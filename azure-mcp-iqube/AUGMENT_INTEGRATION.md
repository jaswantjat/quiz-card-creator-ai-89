# iQube Azure MCP Integration with Augment

## Quick Start Guide

### 1. Setup Azure MCP Server

```bash
# Navigate to the MCP directory
cd azure-mcp-iqube

# Activate Python environment
source azure-mcp-env/bin/activate  # Linux/Mac
# OR azure-mcp-env\Scripts\activate  # Windows

# Install dependencies (if not already done)
pip install -r requirements.txt

# Test the MCP server
python test_mcp_server.py
```

### 2. Configure Augment MCP Client

Add the following configuration to your Augment MCP settings:

```json
{
  "mcpServers": {
    "iqube-azure-sql": {
      "command": "python",
      "args": ["iqube_azure_mcp_server.py"],
      "cwd": "./azure-mcp-iqube",
      "env": {
        "AZURE_SQL_SERVER": "iqube-sql-jaswant.database.windows.net",
        "AZURE_SQL_DATABASE": "iqube_db",
        "AZURE_SQL_USERNAME": "CloudSAaf673f5f",
        "AZURE_SQL_PASSWORD": "Mh15ga2226"
      }
    }
  }
}
```

### 3. Test MCP Connection in Augment

Once configured, you can use these commands in Augment:

#### Database Connectivity
```
Test the iQube database connection
```

#### User Management
```
Check if user test@iqube.com exists in the database
```

```
Register a new user with email: newuser@iqube.com, password: SecurePass123, firstName: New, lastName: User
```

```
Authenticate user test@iqube.com with password TestPassword123
```

#### Question Management
```
Get available question topics for iQube
```

```
Save a question for user ID 1: "What is machine learning?" in topic "Business & AI"
```

```
Get all saved questions for user ID 1
```

#### Database Administration
```
Initialize the iQube database schema
```

```
Get database statistics and user activity
```

### 4. Debugging Railway Issues

Use MCP to debug Railway authentication problems:

```
Compare Railway authentication with direct database access for user test@iqube.com
```

```
Test all database operations to verify connectivity
```

## Available MCP Methods

### Core Database Operations
- `test_connection()` - Test Azure SQL connectivity
- `initialize_database_schema()` - Set up database tables
- `get_database_stats()` - Get usage statistics

### User Management
- `check_user_exists(email)` - Check if user exists
- `register_user(email, password, firstName, lastName)` - Register new user
- `authenticate_user(email, password)` - Authenticate login

### Question Operations
- `get_question_topics()` - Get available topics
- `save_user_question(userId, questionData)` - Save question
- `get_user_questions(userId)` - Get user's questions

## Troubleshooting

### Connection Issues
1. Verify Azure SQL firewall allows your IP
2. Check environment variables in .env file
3. Ensure ODBC Driver 18 for SQL Server is installed

### Authentication Problems
1. Test direct database connection first
2. Compare with Railway API responses
3. Check password hashing compatibility

### Performance Issues
1. Monitor database connection pool
2. Check query execution times
3. Verify index usage

## Benefits of MCP Integration

✅ **Direct Database Access** - Bypass Railway firewall issues
✅ **Real-time Debugging** - Test queries directly through Augment
✅ **Alternative Authentication** - Working auth when Railway fails
✅ **Database Monitoring** - Live stats and health checks
✅ **Development Efficiency** - Test and debug without deployment

## Security Considerations

- Environment variables are used for credentials
- Passwords are properly hashed with bcrypt
- JWT tokens for session management
- SQL injection protection with parameterized queries
- Connection pooling for performance

## Next Steps

1. Run the test suite to verify everything works
2. Configure Augment with the MCP server
3. Test authentication flows through MCP
4. Use MCP to debug Railway issues
5. Monitor database performance and usage
