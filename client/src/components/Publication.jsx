import { useState, useEffect } from "react";
// import documents from '../assets/data/documents.json';
import { pdfjs, Document, Page } from 'react-pdf';
import { CardContent, TextField, Switch, DialogActions, Button, DialogTitle, DialogContentText, DialogContent, Grid, Typography, Card, CircularProgress, Paper, Dialog, FormGroup, FormControlLabel } from "@mui/material";
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import { useParams } from "react-router";
import Publication1 from "../assets/files/Publication1.pdf"
import Publication2 from "../assets/files/Publication2.pdf"
import Publication3 from "../assets/files/Publication3.pdf"
import Publication4 from "../assets/files/Publication4.pdf"
import TextEditor from "./TextEditor";
import axios from "axios";

const files = {
    "GL Guess": Publication1,
    "I Charge, Therefore I Drive: Current State of Electric Vehicle Charging Systems": Publication2,
    "Underwater vehicles: A review of the current state of the art and future directions": Publication3,
    "Publication4": Publication4
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();


export default function Publication() {
    const { id } = useParams();
    const [publication, setPublication] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const init = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/docs/documents/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setPublication(res.data);
        } catch (error) {
            console.error('Error fetching document:', error); // Log any errors
        }
        setIsLoading(false);
    }
    // const init = () => {
    //     setIsLoading(true);
    //     try {
    //         const docId = Number(id);
    //         const doc = documents.find(document => document.id === docId);
    //         console.log(documents);
    //         if (doc) {
    //             setPublication(doc);
    //         } else {
    //             console.error('Document not found');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching document:', error); // Log any errors
    //     }
    //     setIsLoading(false);
    // }

    useEffect(() => {
        init();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }
    console.log(publication.fileUrl);

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
                        <PreviewFile title={publication.title} id={publication._id} fileType={publication.fileUrl} />
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

function PreviewFile({ title, id, fileType }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    console.log(id);

    useEffect(() => {
        const fetchPdfFile = async () => {
            try {
                const response = await fetch(`http://localhost:3000/files/${fileType}`);
                const data = await response.blob();
                const url = URL.createObjectURL(data);
                setPdfUrl(url);
            } catch (error) {
                console.error('Error fetching PDF file:', error);
            }
        };

        if (fileType) {
            fetchPdfFile();
        } else {
            setPdfUrl(null);
        }
    }, [fileType]);

    return (
        <div style={{ padding: '50px', backgroundColor: '#dedede', marginTop: '50px' }}>
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title={title}
                    width="100%"
                    height="600"
                    style={{ border: 'none' }}
                />
            ) : (
                <TextEditor documentId={id} />
            )}
        </div>
    );
}

function CommentDoc({ publication }) {
    const { _id, title, comments } = publication;
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const closeCommentBox = () => {
        setIsCommentOpen(false);
        setNewComment('');
    };


    const openCommentBox = () => setIsCommentOpen(true);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (newComment) {
            try {
                const user = localStorage.getItem('user');
                console.log(user);
                await axios.post(`http://localhost:3000/docs/documents/${_id}/comments`, {
                    text: newComment,
                    createdBy: user.username, // Assuming user ID is stored in localStorage
                });
                setNewComment('');
                fetchComments(); // Fetch updated comments after submission
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
        closeCommentBox();
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/docs/documents/${_id}/comments`);
            // Update the comments state with the fetched comments
            publication.comments = response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchComments(); // Fetch comments when the component mounts
    }, []);


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
                        {Array.isArray(comments) && comments.map((comment) => comment && (
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
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCommentBox}>Close</Button>
                    <Button onClick={handleCommentSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}