const { Customer, validate } = require("./../models/customers");
const express = require("express");
const router = express.Router();

//all records get
router.get("/", async (req, res) => {
  const result = await Customer.find();
  res.send(result);
});

//single record get
router.get("/:id", async (req, res) => {
  try {
    const result = await Customer.find({ _id: req.params.id });
    res.send(result);
    if (!result) return res.status(404).send("No Customer Found");
  } catch (err) {
    res.send(err);
  }
});

//insert to db
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details);
  try {
    const customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    const result = await customer.save();
    if (!result) return res.status(400).send("Object is not saved");
    res.send("Object is saved");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//update record
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details);

  try {
    const result = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { new: true }
    );
    if (!result) return res.status(404).send("No Customer Found");

    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//delete records

router.delete("/:id", async (req, res) => {
  try {
    const result = await Customer.deleteOne({ _id: req.params.id });
    if (!result) return res.status(404).send("No Customer Found");

    res.send("Customer has been deleted.");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
