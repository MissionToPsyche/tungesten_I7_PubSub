const User = require('../models/User');
const { publishLog } = require("kafka");

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
        }).select('_id');

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Team.updateMany(
            { members: userToDelete._id },
            { $pull: { members: userToDelete._id } }
        );
        await User.findByIdAndDelete(userToDelete._id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { deleteUserByAdmin }