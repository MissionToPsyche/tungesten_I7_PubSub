const User = require('../models/User');
const Team = require('../models/Team');

async function createTeam(req, res) {
    const { name, membersUsernames } = req.body;

    try {
        let userIds = [];
        if (membersUsernames && membersUsernames.length > 0) {
            const users = await User.find({
                $or: [
                    { username: { $in: membersUsernames } },
                    { email: { $in: membersUsernames } }
                ]
            });
            userIds = users.map(user => user._id);
        }
        const team = new Team({ name, members: userIds });
        const savedTeam = await team.save();
        if (userIds.length > 0) {
            await Promise.all(userIds.map(userId =>
                User.findByIdAndUpdate(userId, { $push: { teams: savedTeam._id } }, { new: true })
            ));
        }

        res.status(201).json({
            message: 'Team created successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




module.exports = { createTeam, updateTeam, deleteTeam, getTeam }