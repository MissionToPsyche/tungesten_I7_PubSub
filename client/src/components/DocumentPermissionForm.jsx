import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography } from '@mui/material';

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
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Grant/Revoke Permissions</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Document ID"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Permission Type</InputLabel>
                    <Select
                        value={permissionType}
                        onChange={(e) => setPermissionType(e.target.value)}
                    >
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="edit">Edit</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </form>
            {message && <Typography variant="body1">{message}</Typography>}
        </Container>
    );
};

export default DocumentPermissionForm;
