const { model } = require("mongoose");
const { adminSchema } = require("../schema/admin");

const admin = new model("admin", adminSchema);
module.exports = { admin };
