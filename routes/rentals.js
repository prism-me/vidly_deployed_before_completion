const { Rental, validate } = require("../models/rentals");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");
const router = express.Router();

// transactions controll
// Fawn.init(mongoose);
Fawn.init("mongodb://localhost/vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie not found");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const rental = await Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  } catch (ex) {
    console.log("execption");
  }
});

module.exports = router;
