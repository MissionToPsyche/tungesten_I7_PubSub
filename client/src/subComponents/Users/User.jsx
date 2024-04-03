import { useState, useEffect } from 'react';
import { Button, Box, TextField, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function User() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    // const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [userDocuments, setUserDocuments] = useState([]);

    const curuser = JSON.parse(localStorage.getItem('user'));
    const userRole = curuser ? curuser.user.role : '';
    console.log('User Role: ', userRole);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/auth/current-user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const user = res.data;
                setUser(user);
                setUsername(user.user.username);
                // setEmail(user.email);
                setDateOfBirth(user.dateOfBirth);
                setImage(user.image);
                console.log('Users: ', user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        const fetchDocuments = async () => {
            try {
                const res = await axios.get('http://localhost:3000/docs/fetchAll');
                const documents = res.data;
                console.log('Documents: ', documents);
                const userDocuments = documents.filter(doc => doc.author === user.user.username);
                setUserDocuments(userDocuments);
                console.log('user document: ', userDocuments);
                console.log('User Documents: ', userDocuments);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
        fetchUser();
        fetchDocuments();
    }, []);

    // const documentsString = localStorage.getItem('documents');

    // const documents = documentsString ? JSON.parse(documentsString) : [];
    // console.log(documents);

    // const userDocuments = documents.filter(doc => doc.user.userId === user.userId);
    // console.log(userDocuments);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        // Update user data in local storage
        const updatedUser = { ...user, username, email, dateOfBirth, password, image };
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const handleSignOut = () => {
        // Clear user data from local storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/login');
    };

    const handleDeleteAccount = () => {
        // Delete user data from local storage
        localStorage.removeItem("user");
        navigate('/login');
    };

    const handleOpenDoc = (id) => {
        navigate(`/document/${id}`);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <Avatar style={{ width: '160px', height: '160px', marginBottom: '16px' }} src={image} alt={username} />
            <form style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '400px', marginBottom: '16px' }} onSubmit={handleFormSubmit}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input type="file" onChange={handleImageUpload} />
                </div>
                {userRole === 'admin' ? (
                    <>
                        <TextField
                            style={{ margin: '16px' }}
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {/* <TextField
                            style={{ margin: '16px' }}
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        /> */}
                    </>
                ) : (
                    <>
                        <TextField
                            style={{ margin: '16px' }}
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled
                        />
                        {/* <TextField
                            style={{ margin: '16px' }}
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                        /> */}
                    </>
                )}
                <TextField
                    style={{ margin: '16px' }}
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant='contained' type="submit">Update Profile</Button>
            </form>
            <h2>Published Documents</h2>
            <Box display="flex" justifyContent="center">
                <TableContainer>
                    <Table style={{ width: '100%', maxWidth: '600px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Title</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userDocuments.map((doc) => (
                                <TableRow sx={{ cursor: 'pointer' }} key={doc.id} onClick={() => handleOpenDoc(doc.id)}>
                                    <TableCell>{doc.title}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {userRole === 'admin' ? (
                <Button variant='contained' onClick={handleSignOut}>Sign Out</Button>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '30%' }}>
                    <Button variant='contained' onClick={handleSignOut}>Sign Out</Button>
                    <Button variant='contained' color='error' onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
            )}
        </div>
    );
}

{/* <h2>Shared Documents</h2>
            <Box display="flex" justifyContent="center">
                <TableContainer>
                    <Table style={{ width: '100%', maxWidth: '600px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Document ID</TableCell>
                                <TableCell>Title</TableCell>
                            </TableRow>
                        </TableHead>
                        {/* <TableBody>
                            {user.documents.length > 0 ? (
                                user.sharedDocuments.map((doc) => (
                                    <TableRow sx={{ cursor: 'pointer' }} key={doc.id} onClick={() => handleOpenDoc(doc.id)}>
                                        <TableCell>{doc.id}</TableCell>
                                        <TableCell>{doc.title}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">No shared documents</TableCell>
                                </TableRow>
                            )}
                        </TableBody> */}
//           </Table>
//     </TableContainer>
//</Box> */}