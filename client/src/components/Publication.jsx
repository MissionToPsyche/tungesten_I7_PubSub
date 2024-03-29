import { useState, useEffect } from "react";
import documents from '../assets/data/documents.json';
import { CardContent, TextField, Switch, DialogActions, Button, DialogTitle, DialogContentText, DialogContent, Grid, Typography, Card, CircularProgress, Paper, Dialog, FormGroup, FormControlLabel } from "@mui/material";
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import { useParams } from "react-router";
import Publication1 from "../assets/files/Publication1.pdf"
import Publication2 from "../assets/files/Publication2.pdf"
import Publication3 from "../assets/files/Publication3.pdf"
import Publication4 from "../assets/files/Publication4.pdf"
import axios from "axios";

const files = {
    "GL Guess": Publication1,
    "I Charge, Therefore I Drive: Current State of Electric Vehicle Charging Systems": Publication2,
    "Underwater vehicles: A review of the current state of the art and future directions": Publication3,
    "Publication4": Publication4
};


export default function Publication() {
    const { id } = useParams();
    const [publication, setPublication] = useState({});
    const [isLoading, setIsLoading] = useState(true);



    // const init = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await axios.get(`http://localhost:3000/docs/documents/${id}`, {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //         setPublication(res.data);
    //     } catch (error) {
    //         console.error('Error fetching document:', error); // Log any errors
    //     }
    //     setIsLoading(false);
    // }
    const init = () => {
        setIsLoading(true);
        try {
            const docId = Number(id);
            const doc = documents.find(document => document.id === docId);
            console.log(documents);
            if (doc) {
                setPublication(doc);
            } else {
                console.error('Document not found');
            }
        } catch (error) {
            console.error('Error fetching document:', error); // Log any errors
        }
        setIsLoading(false);
    }

    useEffect(() => {
        init();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <EditTopper title={publication.title} />
            <Grid container>
                <Grid item lg={8} md={12} sm={12}>
                    <DocCard publication={publication} />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CommentDoc publication={publication} />
                </Grid>
            </Grid>
            <div style={{ margin: '50px 50px' }}>
                <Paper elevation={3} style={{ padding: '20px', margin: '50px 0', minHeight: '500px' }}>
                    <Typography variant="h5" component="div">
                        <PreviewFile title={publication.title} />
                    </Typography>
                </Paper>
            </div>
        </>
    )
}

function EditTopper({ title }) {

    return (
        <div style={{ height: 250, background: "#04068d", top: 0, width: "100vw", zIndex: 0, marginBottom: -250 }}>
            <div style={{ height: 250, display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <div>
                    <Typography style={{ color: "white", fontWeight: 600 }} variant="h3" textAlign={"center"}>{title}</Typography>
                </div>
            </div>
        </div>
    )
}

function DocCard({ publication }) {
    var { title, abstract, comments, author } = publication;
    return (
        <div style={{ display: 'flex', justifyContent: "center", marginTop: 200 }}>
            <Card sx={{ width: '100%', marginLeft: 20 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div"> {title} </Typography>
                    <Typography variant="body2" color="text.secondary"> {abstract} </Typography>
                    <Typography variant="body2" color="text.secondary"> Author: {author} </Typography>
                </CardContent>
            </Card>
        </div>
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
                height="550px"
                frameBorder="0"
                onLoad={() => setIsLoading(false)}
                style={{ display: isLoading ? 'none' : 'block' }}
            >
            </iframe>
        </div>
    )
}

function CommentDoc({ publication }) {
    var { _id, title, content, comments, adminAccess } = publication;
    var [isCommentOpen, setIsCommentOpen] = useState(false);

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

    const openCommentBox = () => setIsCommentOpen(true);
    const setAdminAccess = (event) => {
        // event.preventDefault();
        // console.log('clicked', event.target.checked)
        adminAccess = !adminAccess;
    }

    return (
        <div style={{ display: 'flex', justifyContent: "felx-start", marginTop: 200, marginLeft: 10, cursor: 'pointer' }}>
            <InsertCommentOutlinedIcon sx={{ color: 'white' }} fontSize="large" onClick={openCommentBox}></InsertCommentOutlinedIcon>
            {/* <FormGroup>
                <FormControlLabel
                    control={
                        <Switch value={adminAccess} onClick={setAdminAccess} name="admin" />
                    }
                    label="Private"
                />
            </FormGroup> */}
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
    )
}