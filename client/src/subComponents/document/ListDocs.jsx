import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, Select, FormControl, MenuItem, InputLabel, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ListDocs = () => {
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const navigate = useNavigate();

    const handleClickOpen = (id) => {
        setSelectedDoc(id);
    };
    const handleChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    const handleClose = () => {
        setSelectedDoc(null);
    };

    const handleOpenDoc = (id) => {
        navigate(`/document/${id}`);
    }

    const init = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/docs/fetchAll", {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setPublications(res.data);

        } catch (error) {
            console.error('Error fetching documents:', error); // Log any errors
        }
        setIsLoading(false);
    }
    const fetchTeams = async () => {
        try {
            const res = await axios.get("http://localhost:3000/teams/teams", {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setTeams(res.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }
    // const init = async () => {
    //     setIsLoading(true);
    //     try {
    //         // Get the documents string from localStorage
    //         const documentsString = localStorage.getItem('documents');

    //         // Check if the documents string is not null
    //         if (documentsString) {
    //             // Convert the documents string back into an object
    //             const documents = JSON.parse(documentsString);
    //             setPublications(documents);
    //         } else {
    //             throw new Error('No documents found in localStorage');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching documents:', error); // Log any errors
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    useEffect(() => {
        init();
        fetchTeams();
    }, []);

    const handleShare = async () => {
        try {
            console.log(selectedDoc)
            await axios.post(`http://localhost:3000/docs/share/${selectedDoc}`, {
                teamId: selectedTeam,
            });
            console.log('Document shared with the team successfully');
            setSelectedDoc(null);
        } catch (error) {
            console.error('Error sharing document:', error);
        }
    };

    // console.log(publications);

    return (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {publications.map((publication, index) => (
                                <Box component={TableRow}
                                    key={index}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)' // Change this to the color you want on hover
                                        }
                                    }}>
                                    <TableCell onClick={() => handleOpenDoc(publication._id)}>{publication.title}</TableCell>
                                    <TableCell>{publication.author}</TableCell>
                                    <TableCell>{new Date(publication.publicationDate).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleClickOpen(publication._id)}>
                                            Share
                                        </Button>
                                        <Dialog
                                            open={selectedDoc === publication._id}
                                            onClose={handleClose}
                                            PaperProps={{
                                            }}
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {"With who you want to share this document?"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Team</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={selectedTeam}
                                                            label="Team"
                                                            onChange={handleChange}
                                                        >
                                                            {teams.map((team, index) => (
                                                                <MenuItem key={index} value={team._id}>{team.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => handleShare(publication._id)}>Share</Button>
                                                <Button onClick={handleClose}>
                                                    Cancel
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>
                                </Box>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    )
}

export default ListDocs