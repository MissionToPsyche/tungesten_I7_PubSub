import React, { useState } from 'react';
import axios from 'axios';

const PermissionForm = () => {
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
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Grant/Revoke Permissions</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '10px' }}>User Name:</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <label style={{ marginBottom: '10px' }}>Document ID:</label>
                <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <label style={{ marginBottom: '10px' }}>Permission Type:</label>
                <select
                    value={permissionType}
                    onChange={(e) => setPermissionType(e.target.value)}
                    style={{ marginBottom: '20px', padding: '5px' }}
                >
                    <option value="read">Read</option>
                    <option value="edit">Edit</option>
                </select>
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Submit</button>
            </form>
            {message && <p style={{ marginTop: '20px', textAlign: 'center' }}>{message}</p>}
        </div>
    );
};

export default PermissionForm;
