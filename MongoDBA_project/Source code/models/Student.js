const { model } = require("mongoose");
const { studentSchema } = require("../schema/student");

const student = new model("student", studentSchema);
module.exports = { student };
