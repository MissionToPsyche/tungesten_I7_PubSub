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
import { useEffect } from 'react';


function UpdateUser() {

	const defaultTheme = createTheme();
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState(null);
	const [showFullNameError, setFullNameErrorFlag] = useState(false);
	var [showEmailError, setEmailErrorFlag] = useState(false);
	var [dobError, setDobError] = useState(null);
	var [fullNameErrorMessage, setFullNameErrorMessage] = useState('');
	var [emailErrorMessage, setEmailErrorMessage] = useState('');
	var [dateOfBirthErrorMessage, setDobErrorMessage] = useState('');

	useEffect(() => {
		switch (dobError) {
			case 'maxDate':
			case 'minDate':
			case 'disableFuture':
			case 'invalidDate': {
				return setDobErrorMessage('Please enter a valid date of birth.');
			}

			default: {
				return setDobErrorMessage('');
			}
		}
	}, [dobError]);


	const update = () => {
		validateForm('fullName');
		validateForm('date');
		validateForm('email');
		// setFullNameErrorFlag(true);
		// setEmailErrorFlag(true);
		// setFullNameErrorMessage("Full name doesn't exist.");
		// setEmailErrorMessage("Email is wrong");
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
	};

	const validateForm = (element) => {
		if(element === 'email'){
			if(!email.length || (email.length > 0 && (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) == false))){
				setEmailErrorFlag(true);
				setEmailErrorMessage("Enter a valid email");
			}
		}
		if(element === 'fullName'){
			if(fullName === ''){
				setFullNameErrorFlag(true);
				setFullNameErrorMessage("Please enter full name.");
			}
		}
		if(element === 'date'){
			if(dateOfBirth === null){
				setDobError('invalidDate');
			}else{
				setDobError('');
			}
		}
	}

	// const dateOfBirthChanged = (newValue) => {
	// 	setDateOfBirth(newValue);
	// 	validateForm('date');
	// }

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Typography component="h1" variant="h5"> Update User Details </Typography>
					<Box component="form" noValidate sx={{ mt: 1 }}>
						<TextField value={fullName} margin="normal" onBlur={() => validateForm('fullName')} onChange={fullNameChanged} error={showFullNameError} required fullWidth id="fullName" helperText={fullNameErrorMessage} label="Full Name" name="fullName" />
						<TextField value={email} margin="normal" onBlur={() => validateForm('email')} onChange={emailChanged} error={showEmailError} required fullWidth name="email" helperText={emailErrorMessage} label="Email" type="email" id="email" />
						<LocalizationProvider fullWidth margin="normal" dateAdapter={AdapterDayjs}>
							<DatePicker
								sx={{ width: 396, marginTop: 2 }}
								value={dateOfBirth}

								onChange={(newValue) => {setDateOfBirth(newValue)}}
								onError={(error) => setDobError(error)}
								slotProps={{
									textField: {
										required: true,
										helperText: dateOfBirthErrorMessage,
										// onBlur: () => validateForm('date'),
										// error: dateOfBirthErrorMessage.length > 0 ? true : false
									},
								}}
								required
								margin="normal"
								label="Date of Birth"
								disableFuture
							/>
						</LocalizationProvider>
						<Button fullWidth disabled={ (dateOfBirth == null || (dateOfBirthErrorMessage.length ? true : false)) || ( fullName == '' || showFullNameError) || ( email == '' || showEmailError)} onClick={update} variant="contained" sx={{ mt: 3, mb: 2 }}> Update </Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default UpdateUser;
