import { useState, useEffect } from "react";
import { CardContent, Grid, Typography, Card } from "@mui/material";
import { useParams } from "react-router";
import axios from "axios";

export default function Publication() {

    let { pubId } = useParams();
    console.log(pubId);
    const [publication, setPublication] = useState([]);

    useEffect(() => {
        // axios.get(`http://localhost:3000/docs/fetchAll/`, {
        //     method: "GET"
        // }).then((res) => {
        //     setPublication(res.data.documents);
        // });
        let arr = [
            {
                title: 'document 1',
                content: 'Content for demo doc 1',
                comments: ['comment 1 for doc 1', 'comment 2 for doc 1'],
                adminAccess: false
            },
            {
                title: 'document 2',
                content: 'Content for demo doc 2',
                comments: ['comment 1 for doc 2', 'comment 2 for doc 2'],
                adminAccess: false
            },
            {
                title: 'document 3',
                content: 'Content for demo doc 3',
                comments: ['comment 1 for doc 3', 'comment 2 for doc 3'],
                adminAccess: false
            },
            {
                title: 'document 4',
                content: 'Content for demo doc 4',
                comments: ['comment 1 for doc 4', 'comment 2 for doc 4'],
                adminAccess: false
            },
            {
                title: 'document 5',
                content: 'Content for demo doc 5',
                comments: ['comment 1 for doc 5', 'comment 2 for doc 5'],
                adminAccess: false
            },
            {
                title: 'document 6',
                content: 'Content for demo doc 6',
                comments: ['comment 1 for doc 6', 'comment 2 for doc 6'],
                adminAccess: false
            },
            {
                title: 'document 7',
                content: 'Content for demo doc 7',
                comments: ['comment 1 for doc 7', 'comment 2 for doc 7'],
                adminAccess: false
            },
            {
                title: 'document 8',
                content: 'Content for demo doc 8',
                comments: ['comment 1 for doc 8', 'comment 2 for doc 8'],
                adminAccess: false
            }
        ];
        setPublication(arr);
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
