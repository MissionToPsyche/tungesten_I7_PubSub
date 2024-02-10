import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/psycheLogo.png"


export function MuiNavbar() {
    const navigate = useNavigate();

    return (
        <AppBar position='static' color='transparent'>
            <Toolbar>
                {/* <Box sx={{ height: 64 }} alt="Psyche Logo" src={logo}> </Box> */}
                <img src={logo} style={{ height: "4%", width: "4%", marginRight: "1%" }} />
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    PSYCHE
                </Typography>
                <Stack direction='row' spacing={2}>
                    <Button color='inherit' onClick={() => navigate('/')}>Home</Button>
                    <Button color='inherit' onClick={() => navigate('/publications')}>Publications</Button>
                    <Button color='inherit' onClick={() => navigate('/addUser')}>Add User</Button>
                    <Button color='inherit' onClick={() => navigate('/uploaddoc')}>My Uploads</Button>
                    <Button color='inherit' onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button variant="outlined" onClick={() => navigate('/login')}>SignIn</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
} 