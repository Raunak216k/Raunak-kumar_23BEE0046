const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  reg_no: {
    type: String,
    required: true,
  },
  school: String,
  contactNo: Number,
  hostel: String,
  cgpa: Number,
  image: String,
});
module.exports = { studentSchema };
