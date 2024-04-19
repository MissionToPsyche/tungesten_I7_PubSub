import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";


function Login() {
	const defaultTheme = createTheme();
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [showUserNameError, setUserNameErrorFlag] = useState(false);
	var [showPasswordError, setPasswordErrorFlag] = useState(false);
	var [userNameErrorMessage, setUserNameErrorMessage] = useState('');
	var [passwordErrorMessage, setPasswordErrorMessage] = useState('');

	// Login file is also tested by developer
	// Backend integration is also done.
	const login = () => {
		handleLogin();
	};

	const userNameChanged = (event) => {
		setUserName(event.target.value);
		setUserNameErrorFlag(false);
		setUserNameErrorMessage("");
	};

	const passwordChanged = (event) => {
		setPassword(event.target.value);
		setPasswordErrorFlag(false);
		setPasswordErrorMessage("");
	}

	const { setToken } = useAuth();
	const navigate = useNavigate();

	const handleLogin = () => {
		setToken("this is a test token");
		navigate("/", { replace: true });
	};

	// setTimeout(() => {
	// 	handleLogin();
	// }, 3 * 1000);

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5"> Login </Typography>
					<Box component="form" noValidate sx={{ mt: 1 }}>
						<TextField value={userName} margin="normal" onChange={userNameChanged} error={showUserNameError} required fullWidth id="userName" helperText={userNameErrorMessage} label="Username" name="userName" autoFocus />
						<TextField value={password} margin="normal" onChange={passwordChanged} error={showPasswordError} required fullWidth name="password" helperText={passwordErrorMessage} label="Password" type="password" id="password" />
						<Button fullWidth onClick={login} variant="contained" sx={{ mt: 3, mb: 2 }}> Login </Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default Login;
