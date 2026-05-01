const jwt = require("jsonwebtoken");
const { config } = require("../config/app.config");

const defaults = {
  audience: ["user"],
};

const accessTokenSignOptions = {
  expiresIn: config.JWT_EXPIRES_IN,
  secret: config.JWT_SECRET,
};

const signJwtToken = (payload, options) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

module.exports = {
  accessTokenSignOptions,
  signJwtToken,
};
