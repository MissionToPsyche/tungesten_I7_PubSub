import { useState } from 'react';
// import allUsers from '../assets/data/users.json';
import { Typography, Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// const admins = allUsers.filter(user => user.role === 'admin');
	// const users = allUsers.filter(user => user.role === 'user');

	const navigate = useNavigate();

	const handleLogin = async () => {
		const res = await axios.post(`http://localhost:3000/auth/login`, {
			username,
			password
		}, {
			headers: {
				"Content-type": "application/json"
			}
		})
		let data = res.data;
		localStorage.setItem("token", data.token);
		navigate("/");
		window.location.reload();
	}
	// async () => {
	// 	const user = [...admins, ...users].find(user => user.username === username && user.password === password);

	// 	if (user) {
	// 		localStorage.setItem("user", JSON.stringify(user));
	// 		navigate("/");
	// 	} else {
	// 		alert("Invalid username or password");
	// 	}
	// };

	return (<div>
		<center style={{ marginTop: 150 }}>
			<Typography variant="h5">Login to your Account</Typography>
			<br />
			<Card variant="outlined" style={{ width: 400, padding: 20 }}>
				<div>
					<TextField fullWidth={true} variant="outlined" label="Username" type={"text"} onChange={e => setUsername(e.target.value)} />
					<br />
					<br />
					<TextField fullWidth={true} variant="outlined" label="Password" type={"password"} onChange={e => setPassword(e.target.value)} />
					<br /> <br />
					<Button variant="contained" onClick={handleLogin}>Sign In</Button>
				</div>
			</Card>
		</center>
	</div>);
}

export default Login;

