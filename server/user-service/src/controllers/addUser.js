const User = require('../models/User');
const Team = require('../models/Team');
const { publishLog } = require("kafka");

function logEntryForUserCreation(newUser, req, teamDetails) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId: newUser._id.toString(),
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        teams: teamDetails,
        actionPerformedBy: req.user.id,
        action: 'create'
    };
    return logEntry
}
// Adds a new user to the system
async function addUser(req, res) {
    try {
        const { username, name, password, email, role, teamNames = [] } = req.body;
        let teamIds = [];
        let teamDetails = []

        if (teamNames.length > 0) {
            const teams = await Team.find({ name: { $in: teamNames } });
            if (teams.length !== teamNames.length) {
                return res.status(400).json({ message: 'One or more specified teams do not exist. Please create the teams first.' });
            }
            teamIds = teams.map(team => team._id);
            teamDetails = teams.map(team => ({
                teamId: team._id.toString(),
                teamName: team.name,
                members: team.members.map(member => member.toString())
            }))
        }
        const newUser = new User({ username, name, password: password, email, role, teams: teamIds });
        const savedUser = await newUser.save();
        const logEntry = await logEntryForUserCreation(savedUser, req, teamDetails);
        console.log(logEntry)
        try {
            await publishLog('user-service-logs', 'UnifiedUserSchema.avsc', logEntry);
        }
        catch (err) {
            await User.findByIdAndDelete(savedUser._id);
            throw new Error('Error publishing log entry');
        }

        res.status(201).json({ message: 'User registered successfully', user: { username, name, email, role, teamNames } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = addUser