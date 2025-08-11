const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "You don't have access" });
};

module.exports = {
  isAuthenticated
};

