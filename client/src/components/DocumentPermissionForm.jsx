import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography, styled } from '@mui/material';

const StyledContainer = styled(Container)({
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
});

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
});

const StyledButton = styled(Button)({
    padding: '10px 20px',
});

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
        <StyledContainer>
            <Typography variant="h4" gutterBottom>Grant/Revoke Permissions</Typography>
            <StyledForm onSubmit={handleSubmit}>
                <TextField
                    label="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Document ID"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Permission Type</InputLabel>
                    <Select
                        value={permissionType}
                        onChange={(e) => setPermissionType(e.target.value)}
                        label="Permission Type"
                    >
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="edit">Edit</MenuItem>
                    </Select>
                </FormControl>
                <StyledButton type="submit" variant="contained" color="primary">Submit</StyledButton>
            </StyledForm>
            {message && <Typography variant="body1">{message}</Typography>}
        </StyledContainer>
    );
};

export default DocumentPermissionForm;
