const User = require("../model/userModel");
const Fuse = require('fuse.js');

const getUsers = async (req, res) => {

  const { substring } = req.query;

    try {
        const users = await User.find({}); // Fetch all users from the database
        const fuseOptions = {
            keys: ['username'],
            shouldSort: true,
            threshold: 0.3 
        };
        const fuse = new Fuse(users, fuseOptions);

        // Perform the fuzzy search
        const result = fuse.search(substring);

        // Sort the results based on their score (descending order)
        const sortedResults = result.sort((a, b) => b.score - a.score);

        res.status(200).json(sortedResults.map(item => item.item));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

module.exports = { getUsers, getAllUsers };