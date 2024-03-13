import { useState } from 'react';
import axios from 'axios';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import { Typography, TextField, Box, Button, Card, CardContent } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';

export default function UploadDoc() {

    const [title, setTitle] = useState("");
    const [textInput, setTextInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [year, setYear] = useState("");

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value);
    };
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div>
            <Typography variant="h3" sx={{ margin: '30px' }}>Upload Publication</Typography>
            <Card variant="outlined" sx={{ padding: '20px', maxWidth: 500, margin: 'auto' }}>
                <TextField variant="outlined" label="Title" type={"text"} onChange={e => setTitle(e.target.value)} fullWidth />
                <TextField
                    id="text-input"
                    label="Abstract"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={textInput}
                    onChange={handleTextInputChange}
                    fullWidth
                    sx={{ marginTop: '20px' }}
                />
                <TextField
                    variant="outlined"
                    label="Year"
                    type="number"
                    onChange={e => setYear(e.target.value)}
                    fullWidth
                    sx={{ marginTop: '20px' }}
                />
                <Box sx={{ marginTop: '20px' }}>
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
                </Box>
                <Box sx={{ marginTop: '20px' }}>
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
                                formData.append('file', selectedFile);
                                formData.append('abstract', textInput);
                                formData.append('title', title);
                                formData.append('ownerUsername', "testUser");
                                formData.append('author', "testUser");

                                try {
                                    await axios.post("http://localhost:3000/docs/upload", formData, {
                                        headers: {
                                            "Content-Type": "multipart/form-data"
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
                </Box>
            </Card>

        </div>
    )
}
