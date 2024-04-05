import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    TextField,
    Avatar,
    ListItem,
    List,
    Popper,
} from '@mui/material';
import axios from 'axios';
// import Jusers from '../assets/data/users.json';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/psycheLogo.png"

// TODO: Replace with actual users
// const users = ['John', 'Oliver', 'Harry', 'George', 'William', 'Jack', 'Jacob', 'Noah', 'Charlie', 'Muhammad', 'Thomas', 'Oscar', 'Alfie', 'Leo', 'Henry', 'Joshua', 'Freddie', 'Archie', 'Ethan', 'Isaac', 'Alexander', 'Joseph', 'Edward', 'Samuel', 'Max', 'Daniel', 'Arthur', 'Lucas', 'Mohammed', 'Logan', 'Theo', 'Harrison', 'Benjamin', 'Mason', 'Sebastian', 'Finley', 'Adam', 'Dylan', 'Zachary', 'Riley', 'Teddy', 'David', 'Toby', 'Theodore', 'Elijah', 'Reuben', 'Louie', 'Jude', 'Frankie', 'Harley', 'Jenson', 'Tommy', 'Mohammad', 'Caleb', 'Carter', 'Elliot', 'Albert', 'Ronnie', 'Louis', 'Rory', 'Luca', 'Jamie', 'Ollie', 'Stanley', 'Bobby', 'Michael', 'Blake', 'Gabriel', 'Elliott', 'Jasper', 'Rowan', 'Felix', 'Jackson', 'Kai', 'Connor', 'Hugo', 'Alex', 'Seth', 'Ellis', 'Liam', 'Cole', 'Ezra', 'Cameron', 'Rory', 'Luca', 'Jamie', 'Ollie', 'Stanley', 'Bobby', 'Michael', 'Blake', 'Gabriel', 'Elliott', 'Jasper', 'Rowan', 'Felix', 'Jackson', 'Kai', 'Connor', 'Hugo', 'Alex', 'Seth', 'Ellis', 'Liam', 'Cole', 'Ezra', 'Cameron']

export function MuiNavbar() {
    const navigate = useNavigate();
    // const user = JSON.parse(localStorage.getItem("user"));
    // const documents = JSON.parse(localStorage.getItem('documents')) || [];
    // const teams = JSON.parse(localStorage.getItem('teams')) || [];

    // localStorage.setItem('users', JSON.stringify(Jusers));
    // const usersString = localStorage.getItem('users');

    // const users = usersString ? JSON.parse(usersString) : [];

    // const usernames = users.map(user => user.username);
    // const items = [
    //     ...usernames.map(username => ({ type: 'User', value: username })),
    //     ...documents.map(document => ({ type: 'Document', value: document.title })),
    //     ...teams.map(team => ({ type: 'Team', value: team.teamName })),
    // ];

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:3000/auth/all-users');
                setUsers(userResponse.data);

                const documentResponse = await axios.get('http://localhost:3000/docs/fetchAll');
                setDocuments(documentResponse.data);

                const teamResponse = await axios.get('http://localhost:3000/teams/teams');
                setTeams(teamResponse.data);

                const token = localStorage.getItem('token');
                if (token) {
                    const user = await axios.get('http://localhost:3000/auth/current-user', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(user.data);
                    // console.log(user.data.user.username);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const items = [
        ...users.map(user => ({ type: 'User', value: user.username })),
        ...documents.map(document => ({ type: 'Document', value: document.title })),
        ...teams.map(team => ({ type: 'Team', value: team.name })),
    ];

    const filteredItems = items.filter(item =>
        `${item.type}: ${item.value}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleNavigate = (type, value) => {
        if (type === 'document') {
            const document = documents.find(doc => doc.title.toLowerCase() === value);
            if (document) {
                navigate(`/document/${document._id}`);
            } else {
                console.error(`No document found with title: ${value}`);
            }
        } else if (type === 'team') {
            const team = teams.find(t => t.name.toLowerCase() === value);
            if (team) {
                navigate(`/team/${team._id}`);
            } else {
                console.error(`No team found with name: ${value}`);
            }
        }
        setSearch('');
    };

    return (
        <AppBar position='static' color='transparent'>
            <Toolbar>
                {/* <Box sx={{ height: 64 }} alt="Psyche Logo" src={logo}> </Box> */}
                <img src={logo} style={{ height: "4%", width: "4%", marginRight: "1%" }} />
                <Typography onClick={() => { navigate('/') }} variant='h6' component='div' sx={{ flexGrow: 1, cursor: 'pointer' }}>
                    PSYCHE
                </Typography>
                <Stack direction='row' spacing={2}>
                    <TextField
                        id="search-bar"
                        label="Search"
                        variant="outlined"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setAnchorEl(e.currentTarget);
                        }}
                    />
                    <Popper open={Boolean(search)} anchorEl={anchorEl} placement="bottom-start">
                        <List>
                            {filteredItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleNavigate(item.type.toLowerCase(), item.value.toLowerCase())}
                                >
                                    {`${item.type}: ${item.value}`}
                                </ListItem>
                            ))}
                        </List>
                    </Popper>
                    {/* <Popper sx={{ backgroundColor: 'rgba(20, 20, 20, 0.5)', color: 'white', width: '220px', borderRadius: '4px' }} open={Boolean(search)} anchorEl={anchorEl} placement="bottom-start">
                        <List>
                            {filteredItems.map((item, index) => (
                                <ListItem key={index} sx={{ cursor: 'pointer' }} onClick={() => {
                                    const type = item.type.toLowerCase();
                                    const value = item.value.toLowerCase();
                                    if (type === 'document') {
                                        const document = documents.find(document => document.title.toLowerCase() === value);
                                        navigate(`/document/${document.id}`);
                                    } else if (type === 'team') {
                                        const team = teams.find(team => team.teamName.toLowerCase() === value);
                                        navigate(`/team/${team.teamId}`);
                                    }
                                    setSearch('');
                                }}>
                                    {`${item.type}: ${item.value}`}
                                </ListItem>
                            ))}
                        </List>
                    </Popper> */}
                    <Button color='inherit' onClick={() => navigate('/')}>Home</Button>
                    <Button color='inherit' onClick={() => navigate('/publications')}>Publications</Button>
                    <Button color='inherit' onClick={() => navigate('/uploaddoc')}>My Uploads</Button>
                    <Button color='inherit' onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    {user ? (
                        <Avatar
                            src={'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.rawpixel.com%2Fsearch%2Fprofile%2520icon&psig=AOvVaw3lOmU8CF2VkoCO8dtK_fFK&ust=1713979392644000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOjkgvjs2IUDFQAAAAAdAAAAABAE'}
                            alt={user.user.username}
                            onClick={() => navigate(`/profile/${user.user.id}`)}
                            sx={{ cursor: 'pointer', alignSelf: 'center' }}
                        />
                    ) : (
                        <Button variant="outlined" onClick={() => navigate('/login')}>SignIn</Button>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    )
} 