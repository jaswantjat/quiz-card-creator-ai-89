export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  };

  // Joi validation error
  if (err.isJoi) {
    error.status = 400;
    error.message = 'Validation Error';
    error.details = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
  }

  // SQL Server errors
  if (err.code) {
    switch (err.code) {
      case 'EREQUEST':
        error.status = 400;
        error.message = 'Database request error';
        break;
      case 'ECONNRESET':
        error.status = 503;
        error.message = 'Database connection lost';
        break;
      case 'ETIMEOUT':
        error.status = 504;
        error.message = 'Database timeout';
        break;
      default:
        error.status = 500;
        error.message = 'Database error';
    }
  }

  // Duplicate key error (unique constraint violation)
  if (err.number === 2627) {
    error.status = 409;
    error.message = 'Resource already exists';
  }

  // Foreign key constraint error
  if (err.number === 547) {
    error.status = 400;
    error.message = 'Invalid reference to related resource';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
    if (error.status === 500) {
      error.message = 'Internal Server Error';
    }
  } else {
    error.stack = err.stack;
  }

  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(error.stack && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
};
