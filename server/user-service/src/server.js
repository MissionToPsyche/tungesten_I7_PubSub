const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { configPaths } = require('./config/configPath');
configPaths();
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { createDummyUsers } = require('./generateUser');
createDummyUsers();
// User routes
app.use('/api/users', userRoutes);

// Basic route for testing server setup
app.get('/', (req, res) => {
    res.send('User Service is running');
});

app.listen(PORT, () => {
    console.log(`User Service listening on port ${PORT}`);
});
