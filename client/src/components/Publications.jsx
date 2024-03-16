import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import Publication1 from "../assets/files/Publication1.pdf"
import Publication2 from "../assets/files/Publication2.pdf"
import Publication3 from "../assets/files/Publication3.pdf"
import Publication4 from "../assets/files/Publication4.pdf"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public'; //adding the icons for using the icon pack


const files = {
    "Publication1": Publication1,
    "Publication2": Publication2,
    "Publication3": Publication3,
    "Publication4": Publication4
};


export default function Publications() {

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

    useEffect(() => {
        init();
        // demoInitMethod();
    }, []);

    const demoInitMethod = () => {
        setIsLoading(true);
		// documentAccess will also be given from the backend in this api call
        let arr = [
            {
                title: 'document 1',
                content: 'Content for demo doc 1',
                comments: ['comment 1 for doc 1', 'comment 2 for doc 1'],
                adminAccess: false,
                documentAccess : ['Edit', 'Read', 'Share']
            },
            {
                title: 'document 2',
                content: 'Content for demo doc 2',
                comments: ['comment 1 for doc 2', 'comment 2 for doc 2'],
                adminAccess: false,
				documentAccess: ["Share", "Read"]
            },
            {
                title: 'document 3',
                content: 'Content for demo doc 3',
                comments: ['comment 1 for doc 3', 'comment 2 for doc 3'],
                adminAccess: false,
				documentAccess: ["Edit", "Read"]
            },
            {
                title: 'document 4',
                content: 'Content for demo doc 4',
                comments: ['comment 1 for doc 4', 'comment 2 for doc 4'],
                adminAccess: false,
				documentAccess: ["Read"]
            },
            {
                title: 'document 5',
                content: 'Content for demo doc 5',
                comments: ['comment 1 for doc 5', 'comment 2 for doc 5'],
                adminAccess: false,
				documentAccess: ["Share"]
            },
            {
                title: 'document 6',
                content: 'Content for demo doc 6',
                comments: ['comment 1 for doc 6', 'comment 2 for doc 6'],
                adminAccess: false,
				documentAccess: ["Share", "Edit"]
            },
            {
                title: 'document 7',
                content: 'Content for demo doc 7',
                comments: ['comment 1 for doc 7', 'comment 2 for doc 7'],
                adminAccess: false,
				documentAccess: ["Edit"]
            },
            {
                title: 'document 8',
                content: 'Content for demo doc 8',
                comments: ['comment 1 for doc 8', 'comment 2 for doc 8'],
                adminAccess: false,
				documentAccess: ["Share", "Read", "Edit"]
            }
        ];

		// if later on , we decide to add new api for adding documentAccess, then the code will be imlemented here.
        setPublications(arr);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    const handleChange = (event, value) => {
        setPage(value);
    };


    return (
        <div>
            <Typography variant="h3" sx={{ margin: "30px" }}>Publications</Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" minHeight="100vh">
                <Box maxWidth={800}>
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
                            <Pagination count={Math.ceil(publications.length / itemsPerPage)} page={page} onChange={handleChange} />
                        </>
                    )}
                </Box>
            </Box>
        </div>
    )
}

function Publication({ publication }) {
    var { title, content, comments, adminAccess, documentAccess } = publication;
    const navigate = useNavigate();
    var [isCommentOpen, setIsCommentOpen] = useState(false);
    const openCommentBox = () => setIsCommentOpen(true);
    const closeCommentBox = (event, action) => {
        if (action === 'submit') {
            event.preventDefault();
            let formData = new FormData(event.currentTarget);
            let formJson = Object.fromEntries(formData.entries());
            let newComment = formJson.newComment;
            console.log(newComment);
            if (newComment) {
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

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickPermissionMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClosePermissionMenu = () => {
      setAnchorEl(null);
    };

	useEffect(() => {
		// when the accesses change, the api call will be made from here
		// and the view will also be dynamically updated.
	}, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "center", marginTop: 80 }}>
                <Card sx={{ width: 600 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>
                        <PreviewFile title={title} />
                        <Typography Typography variant="body2" >
                            {content}
                        </Typography>
                        <div>
                            <RemoveRedEyeIcon onClick={() => navigate('/viewPDF')}></RemoveRedEyeIcon>
                            <InsertCommentOutlinedIcon onClick={openCommentBox}></InsertCommentOutlinedIcon>
                            {documentAccess && documentAccess.length > 0 && (<MoreVertIcon onClick={handleClickPermissionMenu}></MoreVertIcon>) }
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClosePermissionMenu}
                                anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
                                }}
                                transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
                                }}
                            >
                                {documentAccess && documentAccess.includes("Edit") && (<MenuItem onClick={handleClosePermissionMenu}><EditIcon /> Edit</MenuItem>) }
                                {documentAccess && documentAccess.includes("Read") && (<MenuItem onClick={handleClosePermissionMenu}><ChromeReaderModeIcon /> Read</MenuItem>) }
                                {documentAccess && documentAccess.includes("Share") && (<MenuItem onClick={handleClosePermissionMenu}><IosShareIcon /> Share</MenuItem>) }
                            </Menu>
                            <PublicIcon onClick={() => navigate('/DocumentPermissionForm')}></PublicIcon> {/* redirecting to the form */}

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch value={adminAccess} onClick={setAdminAccess} name="admin" />
                                    }
                                    label="Private"
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
        </div >
    )
}



function PreviewFile({ title }) {
    // TODO: Add logic to preview different file types from backend

    const [isLoading, setIsLoading] = useState(true);
    const file = files[title];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {isLoading && <CircularProgress />}
            <iframe
                src={file}
                width="100%"
                height="100%"
                frameBorder="0"
                onLoad={() => setIsLoading(false)}
                style={{ display: isLoading ? 'none' : 'block' }}
            >
            </iframe>
        </div>
    )
}
