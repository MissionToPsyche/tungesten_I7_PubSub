const User = require('../models/User');
const Team = require('../models/Team');
const { publishLog } = require("kafka");
const { fetchTeamDetails } = require('./userActions');

function logEntryForUserDeletion(userInfo, req, teamDetails) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId: userInfo._id.toString(),
        username: userInfo.username,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        teams: teamDetails,
        actionPerformedBy: req.user.id,
        action: 'delete'
    };
    return logEntry
}

async function deleteUserByAdmin(req, res) {
    const identifier = req.body.username;
    if (!identifier) {
        return res.status(400).json({ message: "An identifier (username or email) is required" });
    }

    try {
        const userToDelete = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        }).select('_id username name email role teams');
        if (!userToDelete) {
            return res.status(401).json({ message: 'User doesnt exist' });
        }
        const teamsDetails = await fetchTeamDetails(userToDelete.teams);
        const logEntry = await logEntryForUserDeletion(userToDelete, req, teamsDetails);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Team.updateMany(
            { members: userToDelete._id },
            { $pull: { members: userToDelete._id } }
        );
        await User.findByIdAndDelete(userToDelete._id);
        publishLog('user-service-logs', 'UnifiedUserSchema.avsc', logEntry);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { deleteUserByAdmin }