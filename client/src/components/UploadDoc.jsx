import { useState } from 'react';
import axios from 'axios';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import { Typography, TextField, Grid, Button } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';

export default function UploadDoc() {

    const [title, setTitle] = useState("");
    const [textInput, setTextInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value);
    };
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div>
            <Typography variant="h3" sx={{ margin: '30px' }}>Upload Publication</Typography>
            <Grid container spacing={2} alignItems="center" direction="column">
                <Grid item>
                    <TextField variant="outlined" label="Title" type={"text"} onChange={e => setTitle(e.target.value)} />
                </Grid>
                <Grid item>
                    <Typography variant="h7">
                        Paste Text or upload a file:
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        id="text-input"
                        label="Text Input"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={textInput}
                        onChange={handleTextInputChange}
                    />
                </Grid>
                <Grid item>
                    <input
                        accept=".txt"
                        id="contained-button-file"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="contained-button-file">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CreateNewFolderIcon />}
                            style={{ backgroundColor: '#EF5965' }}
                        >
                            Browse
                        </Button>
                    </label>
                    {selectedFile && (
                        <Typography variant="subtitle1">
                            {selectedFile.name}
                        </Typography>
                    )}
                </Grid>
                <Grid item>
                    {isLoading ? (
                        <CircularProgress color='primary' thickness={4} />
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!selectedFile && !textInput || isLoading}
                            startIcon={<UploadIcon />}
                            style={{ backgroundColor: '#F57C33', color: 'white', width: '200px' }}
                            onClick={async () => {
                                setIsLoading(true);
                                const formData = new FormData();
                                if (selectedFile) {
                                    formData.append('file', selectedFile);
                                } else {
                                    formData.append('content', textInput);
                                }
                                formData.append('title', title);
                                formData.append('ownerUsername', "testUser");

                                try {
                                    await axios.post("http://localhost:3000/docs/upload", formData, {
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    });
                                    alert("Publication uploaded successfully!");
                                } catch (error) {
                                    if (error.response && error.response.data && error.response.data.message) {
                                        alert(error.response.data.message);
                                    } else {
                                        console.error(error);
                                        alert("An error occurred while uploading the file.");
                                    }
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                        >
                            Upload
                        </Button>
                    )}
                </Grid>
            </Grid>

        </div>
    )
}
