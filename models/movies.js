const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genres");

const Movie = mongoose.model(
  "movies",
  new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number,
  })
);

const validateData = (data) => {
  const schema = {
    title: Joi.string().min(3).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  };
  return Joi.validate(data, schema);
};

exports.Movie = Movie;
exports.validate = validateData;
