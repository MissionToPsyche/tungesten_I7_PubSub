import { useState, useEffect } from "react";
// import Tteams from '../../assets/data/teams.json';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";


export function ManageTeams() {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get('http://localhost:3000/teams/teams');
                const data = res.data;
                setTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchTeams();
        // if (!localStorage.getItem('teams')) {
        //     localStorage.setItem('teams', JSON.stringify(Tteams));
        // }

        // const storedTeams = JSON.parse(localStorage.getItem('teams')) || [];

        // setTeams(storedTeams);
    }, []);

    const handleOpenTeamProf = (id) => {
        navigate(`/team/${id}`);
    }

    const handleDelete = async (teamId) => {
        console.log("Delete team with id: ", teamId);
        try {
            await axios.delete(`http://localhost:3000/teams/delete-team/${teamId}`);
            const updatedTeams = teams.filter(team => team._id !== teamId);
            setTeams(updatedTeams);
        } catch (error) {
            console.error('Error deleting team:', error);
        }

        // // Get the existing teams data from localStorage
        // const existingTeams = JSON.parse(localStorage.getItem('teams')) || [];

        // // Filter out the team to be deleted
        // const updatedTeams = existingTeams.filter(team => team.teamId !== teamId);

        // // Store the updated teams data in localStorage
        // localStorage.setItem('teams', JSON.stringify(updatedTeams));

        // // Update the teams state to re-render the component
        // setTeams(updatedTeams);

        // console.log("Delete team with id: ", teamId);
    };

    // const handleDelete = (teamId) => {
    //     // TODO: Implement delete team functionality
    //     console.log("Delete team with id: ", teamId);
    // };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teams.map((team) => (
                        <TableRow key={team._id}>
                            <TableCell onClick={() => handleOpenTeamProf(team._id)} component="th" scope="row">
                                {team.name}
                            </TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="error" onClick={() => handleDelete(team._id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}