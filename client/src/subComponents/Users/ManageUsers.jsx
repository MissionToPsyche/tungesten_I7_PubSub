import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

export function ManageUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3000/auth/all-users');
                const data = res.data;
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
        // // Get the users string from localStorage
        // const usersString = localStorage.getItem('users');

        // // Convert the users string back into an object
        // const usersData = usersString ? JSON.parse(usersString) : [];

        // setUsers(usersData);
    }, []);

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:3000/auth/delete-user/${userId}`);
            alert('User deleted successfully!');
            const updatedUsers = users.filter(user => user.userId !== userId);
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
        }

        // const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // const updatedUsers = existingUsers.filter(user => user.userId !== userId);

        // localStorage.setItem('users', JSON.stringify(updatedUsers));

        // setUsers(updatedUsers);
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.userId}>
                            <TableCell component="th" scope="row">
                                {user.username}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="error" onClick={() => handleDelete(user._id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
