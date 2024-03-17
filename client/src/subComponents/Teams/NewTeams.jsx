import { useState, useEffect } from 'react';
import { Typography, Button, TextField, Stack, Autocomplete } from '@mui/material';

export function NewTeam() {
    const [tName, setTname] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Get the users data from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Set the users state
        setUsers(storedUsers.map(user => user.username));
    }, []);

    const handleNameChange = (event) => {
        setTname(event.target.value);
    };

    const handleMembersChange = (event, values) => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const selectedUsers = storedUsers.filter(user => values.includes(user.username));
        const selectedUsersData = selectedUsers.map(user => ({
            username: user.username,
            userId: user.userId,
            role: user.role
        }));
        // Set the teamMembers state
        setTeamMembers(selectedUsersData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Get the existing teams data from localStorage
        const existingTeams = JSON.parse(localStorage.getItem('teams')) || [];

        // Create a new team object
        const newTeam = {
            teamId: existingTeams.length + 1,
            teamName: tName,
            users: teamMembers
        };

        // Add the new team to the existing teams data
        existingTeams.push(newTeam);

        // Store the updated teams data in localStorage
        localStorage.setItem('teams', JSON.stringify(existingTeams));

        console.log("New team added: ", newTeam);
    };

    return (
        <>
            <Typography sx={{ marginLeft: "35%", marginBottom: 3 }} variant="h5">Enter Details for Creating New Team</Typography>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }} onSubmit={handleSubmit}>
                <TextField
                    label="Team Name"
                    value={tName}
                    onChange={handleNameChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <Stack spacing={3} sx={{ width: 500, marginBottom: 5 }}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={users}
                        onChange={handleMembersChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Select Team Members"
                                placeholder="Users"
                            />
                        )}
                    />
                </Stack>
                <Button type="submit" variant="contained">Send</Button>
            </form >
        </>
    );
}