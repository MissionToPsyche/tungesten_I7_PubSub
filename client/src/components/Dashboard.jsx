import { useEffect, useState } from "react";
import { Typography, Tabs, Tab, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function Dashboard() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log(publications);
    })

    return (
        <div>
            <Typography variant="h3" sx={{ margin: "30px" }}>Admin Dashboard</Typography>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="New User" />
                        <Tab label="Manage Users" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <NewUser />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ManageUsers />
                </TabPanel>
            </Box>
        </div>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function NewUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Email: ", email, "Name: ", name);
    };

    return (
        <>
            <Typography sx={{ marginLeft: "38%" , marginBottom: 3 }} variant="h5">Enter Details for New User</Typography>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }} onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained">Send</Button>
            </form>
        </>
    );
}

function ManageUsers() {
    const users = [
        { id: 1, name: 'User 1', email: 'user1@gmail.com' },
        { id: 2, name: 'User 2', email: 'user2@gmail.com' },
        // TODO: connect to the backend and fetch users
    ];

    const handleDelete = (userId) => {
        // TODO: Implement delete user functionality
        console.log("Delete user with id: ", userId);
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
                        <TableRow key={user.id}>
                            <TableCell component="th" scope="row">
                                {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Dashboard;
