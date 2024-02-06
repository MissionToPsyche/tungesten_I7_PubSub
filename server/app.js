require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/userModel');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Authentication failed. User not found.');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Authentication failed. Wrong password.');
        }
        res.send('User logged in successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint for adding a user
app.post('/add-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).send('A user already exists with this username. Please choose a different username.');
        }
        const newUser = new User({
            username,
            password
        });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
