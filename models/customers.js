const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "customers",
  new mongoose.Schema({
    name: { type: String, required: true },
    isGold: { type: Boolean, required: true },
    phone: { type: String, required: true },
  })
);

const validateData = (data) => {
  const schema = {
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(9).max(13).required(),
  };
  return Joi.validate(data, schema, { abortEarly: false });
};

exports.Customer = Customer;
exports.validate = validateData;
