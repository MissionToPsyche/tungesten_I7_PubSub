const express = require('express');
const accessRouter = express.Router();

const {grantAccess, revokeAccess, updateAccess} = require("../controllers/accessController");

accessRouter.post("/grant/:documentId/:userId", grantAccess);

accessRouter.put("/update/:documentId/:userId", updateAccess);

accessRouter.delete("/revoke/:documentId/:userId", revokeAccess);

module.exports = accessRouter;