import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TableContainer,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from '@mui/material';
import axios from 'axios';
import { AddCircle, Edit, Delete } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

export default function TeamProfile() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [teamDocuments, setTeamDocuments] = useState([]);

  const navigate = useNavigate();

  // const documentsString = localStorage.getItem('documents');
  // const documents = documentsString ? JSON.parse(documentsString) : [];

  // console.log(id)
  useEffect(() => {
    console.log(id)
    axios.get(`http://localhost:3000/teams/team/${id}`)
      .then(response => {
        const teamsData = response.data;
        // console.log('teamsData: ', teamsData);
        if (teamsData) {
          setTeam(teamsData);
          setTeamName(teamsData.name);
          setTeamMembers(teamsData.users);
          fetchTeamDocuments(teamsData.documents);
        } else {
          // Handle the case when the team is not found
          console.log('Team not found');
        }
      })
      .catch(error => console.error('Error:', error));
    console.log(teamMembers)


    // Fetch all users
    axios.get('http://localhost:3000/auth/all-users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error:', error));
    // const teamsData = JSON.parse(localStorage.getItem('teams')) || [];
    // const usersData = JSON.parse(localStorage.getItem('users')) || [];
    // setUsers(usersData);
    // console.log(teamsData);

    // const tId = Number(teamId);
    // console.log(teamId);
    // const currentTeam = teamsData.find(t => t.teamId === tId);
    // console.log(currentTeam);
    // setTeam(currentTeam);
    // setTeamName(currentTeam.teamName);
    // setTeamDescription(currentTeam.teamDescription);
    // setTeamImage(currentTeam.teamImage);
    // setTeamMembers(currentTeam.users);
  }, [id]);

  const fetchTeamDocuments = async (documentIds) => {
    try {
      const documents = await Promise.all(documentIds.map(docId =>
        axios.get(`http://localhost:3000/docs/documents/${docId}`)
          .then(response => {
            console.log(`Document ID: ${docId}, Document Data:`, response.data);
            return response.data;
          })
      ));
      setTeamDocuments(documents);
      console.log(documents)
    } catch (error) {
      console.error('Error fetching team documents:', error);
    }
  };

  useEffect(() => {
    // Fetch the current user's data from the server
    try {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:3000/auth/current-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setCurrentUser(response.data);
          // console.log('Current user:', response.data);
        })
        .catch(error => console.error('Failed to fetch user:', error));
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }, []);
  // console.log(currentUser.user.role);

  useEffect(() => {
    if (currentUser && teamMembers) {
      const isMember = teamMembers.some(member => member === currentUser.username);
      setIsTeamMember(isMember);
    }
  }, [currentUser, teamMembers]);

  // useEffect(() => {
  //   const userString = localStorage.getItem('user');
  //   const user = userString ? JSON.parse(userString) : null;
  //   setCurrentUser(user);
  // }, []);

  // const currentUser = users.find((u) => u.userId === team?.users.find((m) => m.userId === u.userId)?.userId);
  // console.log('current user', currentUser);
  // const isTeamMember = team?.users.some((u) => u.userId === currentUser?.userId);
  // const userDocuments = documents.filter(doc => doc.user.userId === users.userId);
  // console.log(userDocuments);

  const handleEditTeam = () => {
    setIsEditing(true);
  };

  const handleSaveTeam = () => {
    // Update team data in localStorage
    const teamsData = JSON.parse(localStorage.getItem('teams')) || [];
    const updatedTeams = teamsData.map((t) =>
      t.teamId === team.teamId
        ? { ...t, teamName, users: teamMembers }
        : t
    );
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setIsEditing(false);
  };

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { userId: 4, username: 'new_member', role: 'user' }]);
  };

  const handleOpenDoc = (id) => {
    navigate(`/document/${id}`);
  }

  const handleRemoveMember = (id) => {
    const updatedMembers = teamMembers.filter((m) => m.index !== id);
    setTeamMembers(updatedMembers);
  }


  return (
    <Box>
      <StyledCard style={{ backgroundColor: 'lightgrey' }}>
        <CardContent>
          {isEditing ? (
            <TextField
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              label="Team Name"
              variant="outlined"
            />
          ) : (
            <Typography variant="h5">{teamName}</Typography>
          )}
          {(isTeamMember || currentUser?.user?.role === 'admin') && (
            <Box>
              {isEditing ? (
                <Button variant="contained" onClick={handleSaveTeam}>
                  Save
                </Button>
              ) : (
                <Tooltip title="Edit Team">
                  <IconButton onClick={handleEditTeam}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </CardContent>
      </StyledCard>

      <Box mt={4}>
        <Typography variant="h6">Team Members</Typography>
        <Grid container spacing={2}>
          {teamMembers.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1">{member}</Typography>
                    {currentUser?.user?.role === 'admin' && (
                      <Tooltip title="Remove Member">
                        <IconButton onClick={() => handleRemoveMember(member.index)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {(isTeamMember || currentUser?.user?.role === 'admin') && (
            <Grid item xs={12} sm={6} md={4}>
              <Tooltip title="Add Member">
                <IconButton onClick={handleAddMember}>
                  <AddCircle />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" gutterBottom component="div">
          Documents
        </Typography>
        <Box display="flex" justifyContent="center">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Title</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Date Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamDocuments.map((doc) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    key={doc.id}
                    onClick={() => handleOpenDoc(doc.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell component="th" scope="row">
                      {doc.title}
                    </TableCell>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
