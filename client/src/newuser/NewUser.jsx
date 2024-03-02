import TextField from '@mui/material/TextField';

export const NewUser = () => {


    return (
        <>
            <h1>Add User</h1>
            <TextField
                margin="normal"
                required
                fullWidth
                id="User Name"
                name="Type user's name"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="User last Name"
                name="Type user's last name"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="User Email"
                name="Type user's Email"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="Group user"
                name="Type group of user"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="Password"
                name="Type user's password"
            />

            <p>*Password must have 1 Uppercase, 1 Lowercase, 1 Digit, and be a minimum of 8 characters</p>
        </>
    )
}


