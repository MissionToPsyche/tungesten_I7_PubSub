const {Document, Comment} = require("../model/documentSchema");
const User = require("../model/userModel");

const grantAccess = async () => {
    try {
        const document = await Document.findById(req.params.documentId);
        const user = await User.findById(req.params.userId);
        if (!document || !user) {
            return res.status(404).json({ message: "Document or User not found." });
        }

        // Check if the user already has access
        const existingAccess = document.accessControls.find(access => access.entity.toString() === user._id.toString());
        if (existingAccess) {
            return res.status(400).json({ message: "User already has access to this document." });
        }

        // Add access to the document for the user
        document.accessControls.push({ entity: user._id, entityType: 'User', permissions: ['read'] });
        await document.save();

        res.status(200).json({ message: "Access granted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const revokeAccess = async () => {
  try {
    const document = await Document.findById(req.params.documentId);
    const user = await User.findById(req.params.userId);
    if (!document || !user) {
        return res.status(404).json({ message: "Document or User not found." });
    }

    // Check if the user has access
    const accessIndex = document.accessControls.findIndex(access => access.entity.toString() === user._id.toString());
    if (accessIndex === -1) {
        return res.status(400).json({ message: "User does not have access to this document." });
    }

    // Remove user's access to the document
    document.accessControls.splice(accessIndex, 1);
    await document.save();

    res.status(200).json({ message: "Access revoked successfully." });
} catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
} 
}

const updateAccess = async () => {
    try {
        const document = await Document.findById(req.params.documentId);
        const user = await User.findById(req.params.userId);
        if (!document || !user) {
            return res.status(404).json({ message: "Document or User not found." });
        }

        // Check if the user already has access
        const access = document.accessControls.find(access => access.entity.toString() === user._id.toString());
        if (!access) {
            return res.status(400).json({ message: "User does not have access to this document." });
        }

        // Update access permissions if necessary
        access.permissions = req.body.permissions || access.permissions;
        await document.save();

        res.status(200).json({ message: "Access updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {grantAccess, revokeAccess, updateAccess};