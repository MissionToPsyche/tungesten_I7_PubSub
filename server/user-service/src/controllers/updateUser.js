const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Team = require('../models/Team');
const crypto = require('crypto');

// Configure AWS SDK for JavaScript
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

async function updateUserProfile(req, res) {
    const { username } = req.body;
    const { oldPassword, newPassword } = req.body;
    const profilePicture = req.file;
    try {
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = {};
        if (oldPassword && newPassword) {
            const match = await bcrypt.compare(oldPassword, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Old password does not match' });
            }
            updates.password = await bcrypt.hash(newPassword, 10);
        }
        if (profilePicture) {
            const buffer = profilePicture.buffer;
            const hash = crypto.createHash('sha256');
            hash.update(userId.toString());
            const hashedUserId = hash.digest('hex');

            const key = `profile-pictures/${hashedUserId}-${Date.now()}`;
            const uploadResult = await s3.upload({
                Bucket: process.env.AWS_PROFILE_PICTURE_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: profilePicture.mimetype,
            }).promise();

            updates.profilePictureUrl = uploadResult.Location;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password').select('-teams').select('-_id');

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateUserByAdmin(req, res) {
    const { username, teamNames = [] } = req.body; // Default teamNames to an empty array if not provided
    const updates = {};

    if (req.body.email) updates.email = req.body.email;
    if (req.body.role) updates.role = req.body.role;
    if (req.body.name) updates.name = req.body.name;

    try {
        // Find the user by username
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Fetch all teams to correctly add or remove users from them
        const allTeams = await Team.find({});

        // Teams to be added to the user
        const teamsToAdd = allTeams.filter(team => teamNames.includes(team.name)).map(team => team._id);

        // Teams to be removed from the user
        const teamsToRemove = user.teams.filter(teamId => !teamsToAdd.includes(teamId));

        // Update the user's teams
        updates.teams = teamsToAdd;

        // Apply updates to the user
        await User.findOneAndUpdate({ username: username }, updates, { new: true });

        // Update teams: remove user from teamsToRemove and add user to teamsToAdd
        await Team.updateMany(
            { _id: { $in: teamsToRemove } },
            { $pull: { members: user._id } }
        );
        await Team.updateMany(
            { _id: { $in: teamsToAdd } },
            { $addToSet: { members: user._id } }
        );
        res.json({ message: 'User and teams updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { updateUserProfile, updateUserByAdmin }
