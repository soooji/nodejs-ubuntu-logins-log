var crypto = require("crypto");

var sha512 = function (password, salt) {
  var hash = crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value,
  };
};

var genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

function saltHashPassword(password, incomingSolt) {
  let salt = "";
  if (!incomingSolt) {
    salt = genRandomString(16); /** Gives us salt of length 16 */
  } else {
    salt = incomingSolt;
  }
  var passwordData = sha512(password, salt);
  return passwordData;
}

module.exports = { saltHash: saltHashPassword };
