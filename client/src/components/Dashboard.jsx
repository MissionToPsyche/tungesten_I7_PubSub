import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import axios from "axios";

function Dashboard() {

    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const init = async () => {
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
                        <Grid container spacing={4} justifyContent="center">
                            {publications?.map((publication) => (
                                publication && (
                                    <Grid item xs={12} sm={6} md={4} key={publication.title}>
                                        <Publicaiton publication={publication} />
                                    </Grid>
                                )
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </div>
    )
}

function Publicaiton({ publication }) {
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
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;