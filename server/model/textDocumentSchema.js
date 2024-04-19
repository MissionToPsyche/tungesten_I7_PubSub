const { Schema, model } = require("mongoose");

const textDocumentSchema = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("TextDocument", textDocumentSchema);
