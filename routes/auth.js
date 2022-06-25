const { User, validate, validateLogin } = require("./../models/users");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("./../midllewares/auth");

//create user
router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already exists!");

  try {
    user = await User(_.pick(req.body, ["name", "email", "password"]));
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    res.send(err);
  }
});

//login user
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email/Password is incorrect");

  let validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).send("Email/Password is incorrect");

  const token = user.generateAuthToken();
  return res.send(token);
});

//get my profile

router.get("/me", auth, async (req, res) => {
  const _id = req.user._id;
  const user = await User.findOne({ _id: _id }).select("-password");
  return res.send(user);
});
module.exports = router;
