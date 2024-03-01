import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import FileViewer from "react-file-viewer";
import Publication1 from "../assets/files/Publication1.pdf"
import Publication2 from "../assets/files/Publication2.pdf"
import Publication3 from "../assets/files/Publication3.pdf"
import Publication4 from "../assets/files/Publication4.pdf"


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
    }, []);

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
    const { title, content } = publication;
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