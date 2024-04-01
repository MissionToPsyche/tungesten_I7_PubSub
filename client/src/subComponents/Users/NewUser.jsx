import { useState } from 'react';
import { Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import TextField from '@mui/material/TextField';

export const NewUser = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handleSubmit = () => {

        try {
            axios.post('http://localhost:3000/auth/add-user', {
                username: name,
                email,
                password,
                full_name: fullName,
            });
            alert('New user added successfully!');
        } catch (error) {
            console.error('Error adding new user:', error);
        }

        // event.preventDefault();

        // // Get the existing users data from localStorage
        // const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // // Create a new user object
        // const newUser = {
        //     userId: existingUsers.length + 1,
        //     username: name,
        //     email,
        //     password,
        //     role: 'user',
        // };

        // // Add the new user to the existing users data
        // existingUsers.push(newUser);

        // // Store the updated users data in localStorage
        // localStorage.setItem('users', JSON.stringify(existingUsers));

        // console.log("New user added: ", newUser);
        // alert('New user added successfully!');
    };

    return (
        <>
            <Typography sx={{ marginLeft: "38%", marginBottom: 3 }} variant="h5">Enter Details for New User</Typography>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }} onSubmit={handleSubmit}>
                <TextField
                    label="User Name"
                    value={name}
                    onChange={handleNameChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handlePasswordChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <TextField
                    label="Full Name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                />
                <Button type="submit" variant="contained">Send</Button>
            </form>
        </>
    );
}
// return (
//     <>
//         <h1>Add User</h1>
//         <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="User Name"
//             name="Type user's name"
//         />
//         <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="User last Name"
//             name="Type user's last name"
//         />
//         <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="User Email"
//             name="Type user's Email"
//         />
//         <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="Group user"
//             name="Type group of user"
//         />
//         <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="Password"
//             name="Type user's password"
//         />

//         <p>*Password must have 1 Uppercase, 1 Lowercase, 1 Digit, and be a minimum of 8 characters</p>
//     </>
// )


