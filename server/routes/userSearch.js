const express = require('express');
const userSearchRouter = express.Router();

const {getUsers, getAllUsers} = require("../controllers/userController");

userSearchRouter.get("/all", getAllUsers);

userSearchRouter.get("/some", getUsers);

module.exports = userSearchRouter;
