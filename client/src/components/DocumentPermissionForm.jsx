import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography, styled } from '@mui/material';
import { Close } from '@mui/icons-material';

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

const StyledChip = styled('div')({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '5px',
    marginBottom: '10px',
});

const names = ['Jay', 'Manan', 'Swapnil', 'Devanshu', 'Sudheer'];

const DocumentPermissionForm = () => {
    const [selectedName, setSelectedName] = useState('');
    const [userNameList, setUserNameList] = useState([]);
    const [documentId, setDocumentId] = useState('');
    const [permissionType, setPermissionType] = useState('read');
    const [message, setMessage] = useState('');

    const handleAddUserName = () => {
        setUserNameList([...userNameList, selectedName]);
        setSelectedName('');
    };

    const handleRemoveUserName = (index) => {
        const updatedList = [...userNameList];
        updatedList.splice(index, 1);
        setUserNameList(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Handle submitting userNameList to the backend
            setMessage('Permissions updated successfully');
        } catch (error) {
            setMessage('Failed to update permissions');
        }
    };

    return (
        <StyledContainer>
            <Typography variant="h4" gutterBottom>Grant/Revoke Permissions</Typography>
            <StyledForm onSubmit={handleSubmit}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Select User Name</InputLabel>
                    <Select
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        label="Select User Name"
                    >
                        {names.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <StyledButton type="button" onClick={handleAddUserName} variant="contained" color="primary">Add User Name</StyledButton>
                {userNameList.map((userName, index) => (
                    <StyledChip key={index}>
                        <Typography variant="body1">{userName}</Typography>
                        <Button onClick={() => handleRemoveUserName(index)}><Close /></Button>
                    </StyledChip>
                ))}
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
                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </StyledForm>
            {message && <Typography variant="body1">{message}</Typography>}
        </StyledContainer>
    );
};

export default DocumentPermissionForm;   
