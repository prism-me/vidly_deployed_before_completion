const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model("genre", genreSchema);

const validateData = (data) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(data, schema);
};

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateData;
