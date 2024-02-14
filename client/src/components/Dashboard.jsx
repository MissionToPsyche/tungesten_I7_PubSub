import { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

function Dashboard() {

    const [publications, setPublications] = useState([]);

    // const init = async () => {
    //     const res = await axios.get("http://localhost:3000/docs/fetchAll", {
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     setPublications(res.data.documents);
    //     console.log(res.data);
    // }

    // useEffect(() => {
    //     init();
    // }, []);

    return (
        <div>
            <Typography variant="h3" sx={{ margin: "30px" }}>Dashboard</Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" minHeight="100vh">
                <Box maxWidth={800}>
                    <Typography variant="h5" component="h4" align="center" gutterBottom> Publications </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {publications?.map((publication) => (
                            publication && (
                                <Grid item xs={12} sm={6} md={4} key={publication.title}>
                                    <Publicaiton publication={publication} />
                                </Grid>
                            )
                        ))}
                    </Grid>
                </Box>
            </Box>
        </div>
    )
}

function Publicaiton ({publication}) {
    const { title, content } = publication;
    console.log(title, content);
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