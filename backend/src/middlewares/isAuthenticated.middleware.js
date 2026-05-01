const { UnauthorizedException } = require("../utils/appError");

const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException("Unauthorized. Please log in.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthenticated;
