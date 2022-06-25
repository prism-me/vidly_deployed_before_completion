const { Movie, validate } = require("./../models/movies");
const { Genre } = require("./../models/genres");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//all records get
router.get("/", async (req, res) => {
  const result = await Movie.find();
  res.send(result);
});

//single record get
router.get("/:id", async (req, res) => {
  try {
    const result = await Movie.find({ _id: req.params.id });
    res.send(result);
    if (!result) return res.status(404).send("No Movie Found");
  } catch (err) {
    res.send(err);
  }
});

//insert to db
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.body.genreId))
    return res.status(404).send("Invalid GenreID");

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Genre not found");

  try {
    const movie = new Movie({
      title: req.body.title,
      genre: { _id: genre._id, name: genre.name },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    const result = await movie.save();
    if (!result) return res.status(400).send("Object is not saved");
    res.send("Object is saved");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//update record
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  if (!mongoose.Types.ObjectId.isValid(req.body.genreId))
  return res.status(404).send("Invalid GenreID");
  
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Genre not found");
  
  try {
    const result = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: { _id: genre._id, name: genre.name },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );
    if (!result) return res.status(404).send("No Movie Found");

    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//delete records

router.delete("/:id", async (req, res) => {
  try {
    const result = await Movie.deleteOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No Movie Found");

    res.send("Movie has been deleted.");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
