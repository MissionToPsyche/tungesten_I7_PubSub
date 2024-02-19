import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';

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
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 2",
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 3",
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 4",
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 5",
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 6",
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 7",
                content: "New Content for testing the functionality."
            },
            {
                title: "Document 8",
                content: "New Content for testing the functionality."
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
                            <Pagination sx={ { marginTop : 2 }} count={Math.ceil(publications.length / itemsPerPage)} page={page} onChange={handleChange} />
                        </>
                    )}
                </Box>
            </Box>
        </div>
    )
}

function Publication({ publication }) {
    const { title, content } = publication;
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
                            <InsertCommentOutlinedIcon></InsertCommentOutlinedIcon>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;
