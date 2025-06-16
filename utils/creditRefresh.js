import { getPool } from '../config/database.js';
import sql from 'mssql';

/**
 * Daily Credit Refresh Utility
 * 
 * This module handles the automatic daily refresh of user credits.
 * Credits are refreshed to 10 for all users at midnight in their timezone.
 */

/**
 * Check and refresh credits for users whose daily refresh time has passed
 * This function should be called periodically (e.g., every hour) to ensure
 * users get their credits refreshed at the appropriate time.
 */
export const refreshExpiredCredits = async () => {
  try {
    const pool = await getPool();
    
    // Find users whose credits need to be refreshed
    // We check for users where it's been more than 20 hours since last refresh
    // This accounts for timezone differences and ensures credits are refreshed daily
    const usersToRefresh = await pool.request().query(`
      SELECT 
        id, 
        email, 
        daily_credits, 
        last_credit_refresh, 
        timezone,
        DATEDIFF(hour, last_credit_refresh, GETUTCDATE()) as hours_since_refresh
      FROM users 
      WHERE is_active = 1 
        AND DATEDIFF(hour, last_credit_refresh, GETUTCDATE()) >= 20
        AND daily_credits < 10
    `);

    if (usersToRefresh.recordset.length === 0) {
      console.log('🔄 No users need credit refresh at this time');
      return { refreshed: 0, message: 'No users needed refresh' };
    }

    console.log(`🔄 Found ${usersToRefresh.recordset.length} users needing credit refresh`);

    let refreshedCount = 0;
    const errors = [];

    // Process each user individually to handle any errors gracefully
    for (const user of usersToRefresh.recordset) {
      try {
        // Refresh credits to 10
        const refreshResult = await pool.request()
          .input('userId', sql.UniqueIdentifier, user.id)
          .query(`
            UPDATE users 
            SET daily_credits = 10, 
                last_credit_refresh = GETUTCDATE(),
                updated_at = GETUTCDATE()
            WHERE id = @userId AND is_active = 1
          `);

        if (refreshResult.rowsAffected[0] > 0) {
          // Log the credit refresh transaction
          await pool.request()
            .input('userId', sql.UniqueIdentifier, user.id)
            .input('amount', sql.Int, 10)
            .input('balanceAfter', sql.Int, 10)
            .input('description', sql.NVarChar, 'Automatic daily credit refresh')
            .query(`
              INSERT INTO credit_transactions (user_id, transaction_type, amount, balance_after, description)
              VALUES (@userId, 'refresh', @amount, @balanceAfter, @description)
            `);

          refreshedCount++;
          console.log(`✅ Refreshed credits for user ${user.email} (${user.hours_since_refresh}h since last refresh)`);
        }
      } catch (userError) {
        console.error(`❌ Failed to refresh credits for user ${user.email}:`, userError.message);
        errors.push({ userId: user.id, email: user.email, error: userError.message });
      }
    }

    const result = {
      refreshed: refreshedCount,
      total: usersToRefresh.recordset.length,
      errors: errors.length,
      message: `Successfully refreshed ${refreshedCount} out of ${usersToRefresh.recordset.length} users`
    };

    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} errors occurred during credit refresh:`, errors);
      result.errorDetails = errors;
    }

    console.log(`🎉 Credit refresh completed: ${result.message}`);
    return result;

  } catch (error) {
    console.error('❌ Credit refresh process failed:', error.message);
    throw error;
  }
};

/**
 * Force refresh credits for a specific user (admin function)
 */
export const forceRefreshUserCredits = async (userId) => {
  try {
    const pool = await getPool();

    const refreshResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        UPDATE users 
        SET daily_credits = 10, 
            last_credit_refresh = GETUTCDATE(),
            updated_at = GETUTCDATE()
        OUTPUT INSERTED.email, INSERTED.daily_credits, INSERTED.last_credit_refresh
        WHERE id = @userId AND is_active = 1
      `);

    if (refreshResult.recordset.length === 0) {
      throw new Error('User not found or inactive');
    }

    const user = refreshResult.recordset[0];

    // Log the transaction
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('amount', sql.Int, 10)
      .input('balanceAfter', sql.Int, 10)
      .input('description', sql.NVarChar, 'Admin force refresh')
      .query(`
        INSERT INTO credit_transactions (user_id, transaction_type, amount, balance_after, description)
        VALUES (@userId, 'refresh', @amount, @balanceAfter, @description)
      `);

    console.log(`✅ Force refreshed credits for user ${user.email}`);
    return {
      email: user.email,
      credits: user.daily_credits,
      lastRefresh: user.last_credit_refresh
    };

  } catch (error) {
    console.error('❌ Force refresh failed:', error.message);
    throw error;
  }
};

/**
 * Get credit refresh statistics
 */
export const getCreditRefreshStats = async () => {
  try {
    const pool = await getPool();

    const stats = await pool.request().query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN daily_credits = 10 THEN 1 END) as users_with_full_credits,
        COUNT(CASE WHEN daily_credits = 0 THEN 1 END) as users_with_no_credits,
        AVG(CAST(daily_credits as FLOAT)) as average_credits,
        COUNT(CASE WHEN DATEDIFF(hour, last_credit_refresh, GETUTCDATE()) >= 24 THEN 1 END) as users_needing_refresh
      FROM users 
      WHERE is_active = 1
    `);

    const recentRefreshes = await pool.request().query(`
      SELECT COUNT(*) as recent_refreshes
      FROM credit_transactions 
      WHERE transaction_type = 'refresh' 
        AND created_at >= DATEADD(hour, -24, GETUTCDATE())
    `);

    return {
      totalUsers: stats.recordset[0].total_users,
      usersWithFullCredits: stats.recordset[0].users_with_full_credits,
      usersWithNoCredits: stats.recordset[0].users_with_no_credits,
      averageCredits: Math.round(stats.recordset[0].average_credits * 100) / 100,
      usersNeedingRefresh: stats.recordset[0].users_needing_refresh,
      refreshesLast24Hours: recentRefreshes.recordset[0].recent_refreshes
    };

  } catch (error) {
    console.error('❌ Failed to get credit refresh stats:', error.message);
    throw error;
  }
};
