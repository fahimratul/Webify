// Middleware to protect routes - only authenticated users can access
export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: "Unauthorized",
    message: "You must be logged in to access this resource",
  });
};

// Middleware to allow both authenticated and guest users
export const optionalAuth = (req, res, next) => {
  // Just continue, authentication is optional
  next();
};
