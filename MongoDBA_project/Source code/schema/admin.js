const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: String,
});
adminSchema.plugin(passportLocalMongoose);

module.exports = { adminSchema };
