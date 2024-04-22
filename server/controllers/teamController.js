const Team = require("../model/teamModel");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, users, documents, teamId } = req.body;

    const team = new Team({
      teamId,
      name,
      users,
      documents,
    });

    await team.save();

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a team by teamId
const getTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({ _id: id });
    // console.log('Retrieved team:', team);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findOneAndDelete(id);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTeam,
  getTeam,
  getAllTeams,
  deleteTeam,
};
