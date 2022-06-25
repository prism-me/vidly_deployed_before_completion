const bcrypt = require("bcrypt");

async function run(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

module.exports.encryptPassword = run;
