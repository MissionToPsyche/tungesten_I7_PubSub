import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

    const navigate = useNavigate();

    return (
        <AppBar sx={{ background: 'transparent', padding: '5px' }} position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <a style={{}} href="https://www.nasa.gov/">
                            <img
                                style={{ height: "68px" }}
                                alt="NASA"
                                src='https://psyche.asu.edu/wp-content/themes/psyche/static/img/nasa.svg'
                            />
                        </a>
                        <a href="https://psyche.asu.edu/">
                            <img
                                style={{ height: "68px" }}
                                alt="Psyche"
                                src='https://psyche.asu.edu/wp-content/themes/psyche/static/img/psyche.svg'
                            />
                        </a>
                        <Typography variant="h6" component="div">

                        </Typography>
                    </Box>
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Button color="primary" onClick={() => navigate('/')}>Home</Button>
                    <Button color="primary" onClick={() => navigate('/about')}>About</Button>
                    <Button color="primary" onClick={() => navigate('/upload')}>Upload-Doc</Button>
                    <Button color="primary" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button variant='contained' onClick={() => navigate('/upload')}>Login</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar