const express = require("express");

const authRouter = express.Router();
const {
  userLogin,
  addUser,
  currentUser,
  adminUser,
  allUsers,
  delteUser,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/adminAuth");

// Login endpoint
authRouter.post("/login", userLogin);

// Endpoint for adding a user
authRouter.post("/add-user", addUser);

authRouter.post("/add-admin", adminUser);

authRouter.get("/current-user", authenticateToken, currentUser);

authRouter.get("/all-users", allUsers);

authRouter.delete("/delete-user/:id", delteUser);

module.exports = authRouter;
