const { Genre, validate } = require("./../models/genres");
const express = require("express");
const router = express.Router();
const auth = require("./../midllewares/auth");
const admin = require("./../midllewares/admin");
const asyncMiddleware = require('./../midllewares/async');
//all records get
router.get("/", async (req, res) => {
  const result = await Genre.find();
  res.send(result);
});

//single record get

// router.get("/:id", asyncMiddleware(async (req, res) => {
//     const result = await Genre.find({ _id: req.params.id });
//     res.send(result);
//     if (!result) return res.status(404).send("No Genre Found");

// }));

// use the above middleware in all the route handlers or remove 
// try catch from everywhere then use the 
// express-async-errors library


router.get("/:id", async (req, res) => {
  try {
    const result = await Genre.find({ _id: req.params.id });
    res.send(result);
    if (!result) return res.status(404).send("No Genre Found");
  } catch (err) {
    res.send(err);
  }
});

//insert to db
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = new Genre({
      name: req.body.name,
    });
    const result = await genre.save();
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

  try {
    const result = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    if (!result) return res.status(404).send("No Genre Found");

    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//delete records

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const result = await Genre.deleteOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No Genre Found");

    res.send("Genre has been deleted.");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
