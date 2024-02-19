require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authentication');
const docRouter = require('./routes/documentRoutes');
const searchRouter = require('./routes/searchRoutes');
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Authentication middleware
app.use("/auth", authRouter);
app.use("/docs", docRouter);
app.use("/search", searchRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = app;
