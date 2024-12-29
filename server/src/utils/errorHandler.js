export const errorHandler = (err, req, res, next) => {
  
  // Default message and status code
  let message = err.message || 'Internal Server Error';
  let statusCode = err.statusCode || err.status || 500; 

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    message = 'Validation Error';
    statusCode = 400;  // Validation errors are typically 400 Bad Request
    // Collect all validation error messages
    const validationErrors = Object.values(err.errors).map(error => error.message);
    message = validationErrors.join(', ');  // Combine all validation errors into a single message
  }

  // Send response with error details
  res.status(statusCode).json({ 
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
