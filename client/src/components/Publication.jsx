import { useState, useEffect } from "react";
import { CardContent, Grid, Typography, Card } from "@mui/material";
import { useParams } from "react-router";
import axios from "axios";

export default function Publication() {

    let { pubId } = useParams();
    console.log(pubId);
    const [publication, setPublication] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/docs/fetchAll/`, {
            method: "GET"
        }).then((res) => {
            setPublication(res.data.documents);
        });
    }, []);

    return (
        <div>
            <Grid container>
                <Grid item lg={4} md={12} sm={12}>
                    <PublicationCard publication={publication} />
                </Grid>
            </Grid>
        </div>
    )
}

function PublicationCard({ publication }) {
    const { title, ownerUsername } = publication;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "center", marginTop: 80 }}>
                <Card sx={{ width: 345 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="body2">
                            {ownerUsername}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
