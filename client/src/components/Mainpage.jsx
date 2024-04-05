import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import axios from 'axios';
// import Tteams from '../assets/data/teams.json';
// import users from '../assets/data/users.json';
// import documents from '../assets/data/documents.json';
import { useNavigate } from 'react-router-dom';

export function Mainpage() {
    const theme = useTheme();
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // // Fetch user data from localStorage
        // const userData = JSON.parse(localStorage.getItem('user'));
        // setUser(userData);

        // // Store team, user, and document data in localStorage if they don't already exist
        // if (!localStorage.getItem('users')) {
        //     localStorage.setItem('users', JSON.stringify(users));
        // }
        // if (!localStorage.getItem('documents')) {
        //     localStorage.setItem('documents', JSON.stringify(documents));
        // }
        // if (!localStorage.getItem('teams')) {
        //     localStorage.setItem('teams', JSON.stringify(Tteams));
        // }
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const token = localStorage.getItem('token');
            axios.get('http://localhost:3000/auth/current-user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.error('Failed to fetch user:', error);
                    navigate('/login');
                });
        }

    }, []);

    const handleDocuments = () => {
        navigate('/publications');
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    const handleTextDoc = () => {
        navigate('/uploaddoc');
    };
    // console.log(user.user.username);


    return (
        <Box
            sx={{
                padding: theme.spacing(4),
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: theme.spacing(4),
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Welcome {user?.user.username}!
                        </Typography>
                        <Typography variant="subtitle1">
                            Manage your documents and collaborate with your team.
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Box display="flex" justifyContent="space-between" mt={2} sx={{ gap: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleTextDoc}>
                                    Create New Document
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleDocuments}>
                                    Access Document Library
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleDashboard}>
                                    Manage Teams
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Pubsub Repository
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                This project is about implementing a publish-subscribe (pubsub) system. In this system, publishers produce messages and subscribers consume messages based on topics. The pubsub system decouples the publishers and subscribers, allowing them to communicate without knowing each others identities.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}