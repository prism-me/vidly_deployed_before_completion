const mongoose = require("mongoose");

module.exports = function() {
    mongoose
  .connect("mongodb://localhost:27017/vidly")
  .then(() => console.log("connected to database"))
  .catch(() => console.log("error while connecting to database"));
}