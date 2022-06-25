const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 3, max: 50 },
  email: { type: String, unique: true, required: true, min: 3, max: 255 },
  password: { type: String, required: true, min: 3, max: 1024 },
  isAdmin: { type: Boolean, default: false },
});

//adding function to this model and can be accessible to all modules where we use this..... this is called IEC
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("Users", userSchema);

const validateData = (data) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().required().min(5).max(20),
  };
  return Joi.validate(data, schema);
};

const validateLogin = (data) => {
  const schema = {
    email: Joi.string().min(3).required().email(),
    password: Joi.string().required().min(5).max(20),
  };
  return Joi.validate(data, schema);
};

exports.User = User;
exports.validate = validateData;
exports.validateLogin = validateLogin;
