import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import FileViewer from "react-file-viewer";
import file1 from "../assets/files/1.pdf"
import file2 from "../assets/files/Publication-2.docx"
import file3 from "../assets/files/Publication-3.xlsx"
import file4 from "../assets/files/Publication-4.pptx"


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
                        <PreviewFile files={[
                            { type: 'pdf', path: file1 },
                            { type: 'docx', path: file2 },
                            { type: 'xlsx', path: file3 },
                            { type: 'pptx', path: file4 },]} />
                        <Typography Typography variant="body2" >
                            {content}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

function PreviewFile({ files }) {
    return (
        <div>
            {files.map((file, index) => (
                <FileViewer
                    key={index}
                    fileType={file.type}
                    filePath={file.path}
                />
            ))}
        </div>
    );
}