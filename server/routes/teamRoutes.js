const express = require("express");
const {
  createTeam,
  getTeam,
  getAllTeams,
  deleteTeam,
} = require("../controllers/teamController");

const teamRouter = express.Router();

// Route to create a team
teamRouter.post("/createTeam", createTeam);

// Route to get team data
teamRouter.get("/team/:id", getTeam);

// Route to get all teams
teamRouter.get("/teams", getAllTeams);

teamRouter.delete("/delete-team/:id", deleteTeam);

module.exports = teamRouter;
