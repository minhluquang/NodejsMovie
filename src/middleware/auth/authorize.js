const authorize = (roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied, insufficient permissions!" });
    }
    next(); // User is authorized, proceed to next middleware or route handler
  };
};

module.exports = { authorize };
