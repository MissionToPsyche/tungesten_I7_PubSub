const User = require("../model/userModel");
const Fuse = require('fuse.js');

const getUsers = async (req, res) => {
    const { substring } = req.query;

    try {
        const users = await User.find({}); 
        const fuseOptions = {
            keys: ['username'],
            shouldSort: true,
            threshold: 0.3 
        };
        const fuse = new Fuse(users, fuseOptions);
        const result = fuse.search(substring);

        res.json(result.map(item => item.item));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

module.exports = { getUsers, getAllUsers };