const User = require('../models/User');
const Team = require('../models/Team');
const { publishLog } = require("kafka");

function logEntryForUserCreation(newUser, byUser) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId: newUser._id.toString(),
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        teams: newUser.teams,
        actionPerformedBy: byUser
    };
    return logEntry
}
// Adds a new user to the system
async function addUser(req, res) {
    try {
        const { username, name, password, email, role, teamNames = [] } = req.body;
        let teamIds = [];

        if (teamNames.length > 0) {
            const teams = await Team.find({ name: { $in: teamNames } });
            if (teams.length !== teamNames.length) {
                return res.status(400).json({ message: 'One or more specified teams do not exist. Please create the teams first.' });
            }
            teamIds = teams.map(team => team._id);
        }
        const newUser = new User({ username, name, password: password, email, role, teams: teamIds });
        const savedUser = await newUser.save();

        // Optional: Log entry for user creation, publish to other services, or push to cache as needed
        // const logEntry = await logEntryForUserCreation(savedUser, "admin")
        // await publishLog("user-service-logs", "UserCreated.avsc", logEntry)

        res.status(201).json({ message: 'User registered successfully', user: { username, name, email, role, teamNames } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = addUser