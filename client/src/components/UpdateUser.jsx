import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function UpdateUser() {

	const defaultTheme = createTheme();
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [showFullNameError, setFullNameErrorFlag] = useState(false);
	var [showEmailError, setEmailErrorFlag] = useState(false);
	var [fullNameErrorMessage, setFullNameErrorMessage] = useState('');
	var [emailErrorMessage, setEmailErrorMessage] = useState('');


	const update = () => {
		setFullNameErrorFlag(true);
		setEmailErrorFlag(true);
		setFullNameErrorMessage("Full name doesn't exist.");
		setEmailErrorMessage("Email is wrong");
	};

	const fullNameChanged = (event) => {
		setFullName(event.target.value);
		setFullNameErrorFlag(false);
		setFullNameErrorMessage("");
	};

	const emailChanged = (event) => {
		setEmail(event.target.value);
		setEmailErrorFlag(false);
		setEmailErrorMessage("");
	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Typography component="h1" variant="h5"> Update User Details </Typography>
					<Box component="form" noValidate sx={{ mt: 1 }}>
						<TextField value={fullName} margin="normal" onChange={fullNameChanged} error={showFullNameError} required fullWidth id="fullName" helperText={fullNameErrorMessage} label="Full Name" name="fullName" />
						<TextField value={email} margin="normal" onChange={emailChanged} error={showEmailError} required fullWidth name="email" helperText={emailErrorMessage} label="Email" type="email" id="email" />
						<TextField value={email} margin="normal" onChange={emailChanged} error={showEmailError} required fullWidth name="date" helperText={emailErrorMessage} label="Date of Birth" type="date" id="date" />
						<Button fullWidth onClick={update} variant="contained" sx={{ mt: 3, mb: 2 }}> Update </Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default UpdateUser;
