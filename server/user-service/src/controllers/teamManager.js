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

async function updateTeam(req, res) {
    const { teamName, newTeamName, membersUsernames } = req.body;

    if (!teamName) {
        return res.status(400).json({ message: "Team name must be provided." });
    }

    let update = {};

    try {
        const team = await Team.findOne({ name: teamName }).populate('members');

        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        if (newTeamName) {
            team.name = newTeamName;
        }

        // Fetch users based on membersUsernames
        const users = membersUsernames && membersUsernames.length > 0 ? await User.find({
            $or: [
                { username: { $in: membersUsernames } },
                { email: { $in: membersUsernames } }
            ]
        }) : [];

        // Determine users to add and to remove
        const newMemberIds = users.map(user => user._id.toString());
        const currentMemberIds = team.members.map(member => member._id.toString());

        const membersToAdd = newMemberIds.filter(id => !currentMemberIds.includes(id));
        const membersToRemove = currentMemberIds.filter(id => !newMemberIds.includes(id));

        // Update team's members
        team.members = users;
        await team.save();

        // Add team to new members
        await User.updateMany({ _id: { $in: membersToAdd } }, { $addToSet: { teams: team._id } });

        // Remove team from members no longer in the team
        await User.updateMany({ _id: { $in: membersToRemove } }, { $pull: { teams: team._id } });

        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteTeam(req, res) {
    const { teamName } = req.body;
    try {
        // Find the team by name
        const team = await Team.findOne({ name: teamName });

        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        // Remove the team from all users' documents
        await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });

        // Delete the team
        await team.deleteOne({ name: teamName });
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ message: error.message });
    }
}

async function getTeam(req, res) {
    const { teamName } = req.body;
    try {
        const team = await Team.findOne({ name: teamName }).populate('members', 'name email role -_id').select('-_id -__v');
        res.status(200).json({ team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createTeam, updateTeam, deleteTeam, getTeam }