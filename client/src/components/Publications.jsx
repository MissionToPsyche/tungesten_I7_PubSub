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
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

const files = {
    "Exploring the depths": Publication1,
    "Publication2": Publication2,
    "Publication3": Publication3,
    "Publication4": Publication4
};


export default function Publications() {

    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        author: '',
        abstract: '',
        year: ''
    });

    // Add this function to handle filter changes
    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    const init = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/docs/fetchAll", {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setPublications(res.data);
            // console.log(res.data);
        } catch (error) {
            console.error('Error fetching documents:', error); // Log any errors
        }
        setIsLoading(false);
    }

    const searchDocs = async () => {
        setIsLoading(true);
        if (searchTerm) {
            try {
                let res;
                if (Object.values(filters).some(filter => filter)) {
                    const { author, abstract, year } = filters;
                    console.log(author, abstract, year);
                    res = await axios.get(`http://localhost:3000/search/byFilters?author=${author}&abstract=${abstract}&year=${year}`);
                    console.log("filters:", res);
                } else {
                    res = await axios.get(`http://localhost:3000/search/byTitle?substring=${searchTerm}`);
                    console.log("title", res);
                }
                setSearchResults(res.data);
            } catch (error) {
                console.error('Error searching documents:', error);
            }
        } else {
            setSearchResults([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (searchTerm) {
            searchDocs();
        } else {
            init();
        }
    }, [searchTerm]);

    useEffect(() => {
        searchDocs();
    }, [filters]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <div>
            <Typography variant="h3" sx={{ margin: "30px" }}>Publications</Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" minHeight="100vh">
                <Box maxWidth={800} width="100%">
                        <TextField
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search Publications"
                            variant="outlined"
                            sx={{ marginBottom: "20px", width: "50%" }}
                        />
                    {showFilters && (
                        <>
                            <TextField
                                name="author"
                                value={filters.author}
                                onChange={handleFilterChange}
                                placeholder="Filter by author"
                                variant="outlined"
                                sx={{ marginBottom: "20px", width: "50%" }}
                            />
                            <TextField
                                name="abstract"
                                value={filters.abstract}
                                onChange={handleFilterChange}
                                placeholder="Filter by abstract"
                                variant="outlined"
                                sx={{ marginBottom: "20px", width: "50%" }}
                            />
                            <TextField
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                placeholder="Filter by year"
                                variant="outlined"
                                sx={{ marginBottom: "20px", width: "50%" }}
                            />
                        </>
                    )}
                    <Button onClick={() => setShowFilters(!showFilters)}><MoreVertIcon />More</Button>
                    {isLoading ? (
                        <CircularProgress />
                    ) : searchTerm ? (
                        searchResults.length === 0 ? (
                            <Typography variant="h6" component="h4" align="center" gutterBottom> No documents found </Typography>
                        ) : (
                            // console.log(searchResults),
                            searchResults.map((publication) => (
                                <Publication publication={publication} key={publication._id} />
                            ))
                        )
                    ) : (
                        publications.length === 0 ? (
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
                        )
                    )}
                </Box>
            </Box>
        </div>
    )
}

function Publication({ publication }) {
    var { title, content, comments, adminAccess } = publication;
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
