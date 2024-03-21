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
    

    return (
        <>
            
        </>
    )
}

