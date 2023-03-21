const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    username: Joi.string().required().alphanum().min(3)
      .max(30),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  }),
};

const socialRegistration = {
  body: Joi.object().keys({
    provider: Joi.string().required(),
    socialId: Joi.string().required(),
    email: Joi.string().required().email(),
    name: Joi.object().keys({
      givenName: Joi.string(),
      familyName: Joi.string()
    }),
    profilePicture: Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  socialRegistration,
  register,
  login,
  logout,
  refreshTokens,
  verifyEmail,
};
