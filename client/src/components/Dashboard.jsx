import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';


function Dashboard() {

	const [publications, setPublications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const itemsPerPage = 6;

	const init = async () => {
		setIsLoading(true);
		const res = await axios.get("http://localhost:3000/docs/fetchAll", {
			headers: {
				"Content-Type": "application/json"
			}
		});
		setPublications(res.data.documents);
		setIsLoading(false);
	}

	const newInitMethod = () => {
		setIsLoading(true);
		let arr = [{
			title: "Document 1",
			content: "New Content for testing the functionality.",
			comments: ['comment 1 for doc 1', 'comment 2 for doc 1'],
			adminAccess: true
		},
		{
			title: "Document 2",
			content: "New Content for testing the functionality.",
			comments: ['comment 1 for doc 2', 'comment 2 for doc 2'],
			adminAccess: true
		},
		{
			title: "Document 3",
			content: "New Content for testing the functionality.",
			adminAccess: false
		},
		{
			title: "Document 4",
			content: "New Content for testing the functionality.",
			adminAccess: false
		},
		{
			title: "Document 5",
			content: "New Content for testing the functionality.",
			adminAccess: true
		},
		{
			title: "Document 6",
			content: "New Content for testing the functionality.",
			adminAccess: false
		},
		{
			title: "Document 7",
			content: "New Content for testing the functionality.",
			adminAccess: true
		},
		{
			title: "Document 8",
			content: "New Content for testing the functionality.",
			adminAccess: true
		},
		{
			title: "Document 9",
			content: "New Content for testing the functionality."
		}
		];
		setPublications(arr);
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}

	useEffect(() => {
		// init();
		newInitMethod();
	}, []);

	const handleChange = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		console.log(publications);
	})

	return (
		<div>
			<Typography variant="h3" sx={{ margin: "30px" }}>Dashboard</Typography>
			<Box display="flex" justifyContent="center" flexWrap="wrap" minHeight="100vh">
				<Box maxWidth={800}>
					<Typography variant="h5" component="h4" align="center" gutterBottom> Publications </Typography>
					{isLoading ? (
						<CircularProgress />
					) : publications.length === 0 ? (
						<Typography variant="h6" component="h4" align="center" gutterBottom> No documents found </Typography>
					) : (
						<>
							<Grid container spacing={4} justifyContent="center">
								{publications.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((publication) => (
									publication && (
										<Grid item xs={12} sm={6} md={4} key={publication.title}>
											<Publication publication={publication} />
										</Grid>
									)
								))}
							</Grid>
							<Pagination sx={{ marginTop: 2 }} count={Math.ceil(publications.length / itemsPerPage)} page={page} onChange={handleChange} />
						</>
					)}
				</Box>
			</Box>
		</div>
	)
}

function Publication({ publication }) {
	var { title, content, comments, adminAccess } = publication;

	var [isCommentOpen, setIsCommentOpen] = useState(false);
	const openCommentBox = () => setIsCommentOpen(true);
	const closeCommentBox = (event, action) => {
		if (action === 'submit') {
			event.preventDefault();
			let formData = new FormData(event.currentTarget);
            let formJson = Object.fromEntries(formData.entries());
            let newComment = formJson.newComment;
            console.log(newComment);
			if(newComment){
				comments.push(newComment);
				// api call for sending the comment to backend.
			}
		}
		setIsCommentOpen(false);
	}

	const setAdminAccess = (event) => {
		// event.preventDefault();
		// console.log('clicked', event.target.checked)
		adminAccess = !adminAccess;
	}

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: "center", marginTop: 80 }}>
				<Card sx={{ width: 600 }}>
					<CardContent>
						<Typography variant="h5" component="div">
							{title}
						</Typography>
						<Typography variant="body2">
							{content}
						</Typography>
						<div>
							<InsertCommentOutlinedIcon onClick={openCommentBox}></InsertCommentOutlinedIcon>
							<FormGroup>
							<FormControlLabel
								control={
									<Switch value={adminAccess} onClick={setAdminAccess} name="admin" />
								}
								label="Admin"
								/>
							</FormGroup>
							<Dialog
								open={isCommentOpen}
								onClose={closeCommentBox}
								PaperProps={{
									comments: comments,
									component: 'form',
									onSubmit: (event) => closeCommentBox(event, 'submit')
								}}
							>
								<DialogTitle>Comments</DialogTitle>
								<DialogContent>
									<DialogContentText>
									<Typography id="modal-modal-description" sx={{ mt: 2 }}>
										Comments for document : {title}
									</Typography>
									{comments && comments.map((comment) => comment && (
										<Typography key={comment} id="modal-modal-description" sx={{ mt: 2 }}>
											{comment}
										</Typography>
									))}

									</DialogContentText>
									<TextField
										margin="dense"
										id="newComment"
										name="newComment"
										label="Comment"
										fullWidth
										variant="standard"
									/>
								</DialogContent>
								<DialogActions>
									<Button onClick={closeCommentBox}>Close</Button>
									<Button type="submit">Submit</Button>
								</DialogActions>
							</Dialog>

						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default Dashboard;
