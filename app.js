const Joi = require("joi");
const express = require("express");
const app = express();

require('./startups/db')();
require('./startups/routes')(app);
require('./startups/config')();
require('./startups/prod')(app);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port} ...`));
