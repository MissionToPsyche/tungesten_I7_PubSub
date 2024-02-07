import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Stack,
    Menu,
    MenuItem
} from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import logo from "../../psycheLogo.png"
export const MuiNavbar = () => {

    return (
        <AppBar position='static' color='transparent'>
            <Toolbar>
                {/* <Box sx={{ height: 64 }} alt="Psyche Logo" src={logo}> </Box> */}
                <img src={logo} style={{ height: "4%", width: "4%", marginRight: "1%" }} />
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    PSYCHE
                </Typography>
                <Stack direction='row' spacing={2}>
                    <Button color='inherit'>Home</Button>
                    <Button color='inherit'>Publications</Button>
                    <Button color='inherit'>Add User</Button>
                    <Button color='inherit'>Upload Publication</Button>
                    <Button color='inherit'>Show All Publications</Button>
                    <Button color='inherit'>My Uploads</Button>
                    <Button color='inherit'>Dashboard</Button>
                    <Button color='inherit'>Logout</Button>



                </Stack>

            </Toolbar>
        </AppBar>
    )
}
