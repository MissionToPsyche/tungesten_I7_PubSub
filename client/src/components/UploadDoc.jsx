/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Ddocuments from '../assets/data/documents.json';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Typography, TextField, Box, Button, Card } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';

export function UploadDoc({ showHeader = true }) {

    // Validating the prop showHeader
    if (typeof showHeader !== 'boolean') {
        console.warn(`Invalid prop: showHeader expected a boolean, but received a ${typeof showHeader}`);
    }

    const [title, setTitle] = useState("");
    const [textInput, setTextInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [year, setYear] = useState("");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const storedDocuments = localStorage.getItem('documents');
        if (storedDocuments) {
            setDocuments(JSON.parse(storedDocuments));
        } else {
            const dataString = JSON.stringify(Ddocuments);
            localStorage.setItem('documents', dataString);
            setDocuments(Ddocuments);
        }
    }, []);

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div>
            {showHeader && <Typography variant="h3" sx={{ margin: '30px' }}>Upload Publication</Typography>}
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
                        accept=".pdf"
                        id="contained-button-file"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="contained-button-file">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!selectedFile && !textInput || isLoading}
                                startIcon={<UploadIcon />}
                                style={{ backgroundColor: '#F57C33', color: 'white', width: '200px' }}
                                onClick={async () => {
                                    setIsLoading(true);

                                    try {
                                        const user = JSON.parse(localStorage.getItem('user'));
                                        await axios.post("http://localhost:3000/docs/upload", {
                                            title,
                                            abstract: textInput,
                                            publicationDate: year,
                                            file: selectedFile,
                                            author: user.user.username,
                                            documentType: "research paper"
                                        }, {
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
                            // onClick={async () => {
                            //     setIsLoading(true);

                            //     try {
                            //         const user = JSON.parse(localStorage.getItem('user'));
                            //         const newDocument = {
                            //             id: documents.length + 1,
                            //             title,
                            //             abstract: textInput,
                            //             yearPublished: year,
                            //             file: selectedFile,
                            //             user: {
                            //                 userId: user.userId,
                            //                 username: user.username,
                            //                 role: user.role
                            //             }
                            //         };

                            //         documents.push(newDocument);
                            //         localStorage.setItem('documents', JSON.stringify(documents));
                            //         console.log('Publication added successfully:', newDocument);

                            //         alert('Publication added successfully!');
                            //     } catch (error) {
                            //         console.error('Error adding publication:', error);
                            //         alert('An error occurred while adding the publication.');
                            //     } finally {
                            //         setIsLoading(false);
                            //     }
                            // }}
                            >
                                Upload
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!selectedFile && !textInput || isLoading}
                                startIcon={<CreateNewFolderIcon />}
                                style={{ backgroundColor: '#F57C33', color: 'white', width: '200px' }}
                                onClick={() => {
                                    const user = JSON.parse(localStorage.getItem('user'));
                                    try {
                                        axios.post("http://localhost:3000/docs/create-text-document", {
                                            title,
                                            abstract: textInput,
                                            publicationDate: year,
                                            file: null,
                                            author: user.user.username,
                                            documentType: "text document"
                                        }, {
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        });
                                        alert("Publication uploaded successfully!");
                                    } catch (error) {
                                        console.log('Data:', {
                                            title,
                                            abstract: textInput,
                                            publicationDate: year,
                                            file: null,
                                            author: user.user.username,
                                            documentType: "text document"
                                        });
                                        if (error.response && error.response.data && error.response.data.message) {
                                            alert(error.response.data.message);
                                        } else {
                                            console.error(error);
                                            alert("An error occurred while uploading the file.");
                                        }
                                    }

                                }
                                }
                            >
                                Create New Doc
                            </Button>
                        </div>
                    )}
                </Box>
            </Card>

        </div>
    )
}
