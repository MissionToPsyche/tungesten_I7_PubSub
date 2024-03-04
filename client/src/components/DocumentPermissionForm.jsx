import React, { useState } from 'react';
import axios from 'axios';

const DocumentPermissionForm = () => {
    const [userName, setUserName] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [permissionType, setPermissionType] = useState('read');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/update-permissions', {
                userName,
                documentId,
                permissionType,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to update permissions');
        }
    };

    return (
        <div>
            <h2>Grant/Revoke Permissions</h2>
            <form onSubmit={handleSubmit}>
                <label>User Name:</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label>Document ID:</label>
                <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                />
                <label>Permission Type:</label>
                <select
                    value={permissionType}
                    onChange={(e) => setPermissionType(e.target.value)}
                >
                    <option value="read">Read</option>
                    <option value="edit">Edit</option>
                </select>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DocumentPermissionForm;
