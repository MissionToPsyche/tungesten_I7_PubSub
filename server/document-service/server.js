const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { configPaths } = require('./config/configPath');
configPaths();

// Importing document model and routes
const Document = require('./models/Document'); // Adjust path as necessary
const documentRoutes = require('./routes/documentRoutes'); // Adjust path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/documents', documentRoutes);

// Basic route for testing server is up
app.get('/', (req, res) => {
    res.send('Document Service is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
