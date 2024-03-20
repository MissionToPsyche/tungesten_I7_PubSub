import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

function Profile() {
	const defaultTheme = createTheme();
	var [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		console.log('Api call for fetching profile details goes here.');
		setTempUserInfo();
	}, []);

	const setTempUserInfo = () => {
		let info = {
			name: 'Manan Patel',
			picSvg: '',
			dob: '12/01/1999',
			email: 'mpate133@asu.edu',
			totalDocContribution: 5,
			ownedDocs: [
				{
					docName: 'Owned demo doc 1',
				},
				{
					docName: 'Owned demo doc 2'
				},
				{
					docName: 'Owned demo doc 3'
				}
			],
			sharedDocs: [
				{
					docName: 'Shared doc with Jay'
				},
				{
					docName: 'Shared doc with Swapnil'
				}
			]
		};

		setUserInfo(info);
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					Hello
					<Accordion>
						<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1-content"
						id="panel1-header"
						>
						<Typography>Owned Documents</Typography>
						</AccordionSummary>
						<AccordionDetails>
						<List>
							{userInfo?.ownedDocs?.map((doc, i) => (<ListItem key={i} disablePadding>
								<ListItemButton>
								<ListItemText primary={doc.docName} />
								</ListItemButton>
							</ListItem>))}
						</List>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2-content"
							id="panel2-header"
						>
							<Typography>Shared Documents</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<List>
								{userInfo?.sharedDocs?.map((doc, i) => (<ListItem key={i} disablePadding>
									<ListItemButton>
									<ListItemText primary={doc.docName} />
									</ListItemButton>
								</ListItem>))}
							</List>
						</AccordionDetails>
					</Accordion>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default Profile;
