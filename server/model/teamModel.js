// models/Team.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teamId: {
    type: String,
    unique: true, // This makes `teamId` unique.
  },
  users: {
    type: [String],
    required: true,
  },
  documents: {
    type: [String],
    required: true,
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
