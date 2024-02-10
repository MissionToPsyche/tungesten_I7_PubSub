import { useState } from 'react';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import { Typography, TextField, Grid, Button } from "@mui/material"

export default function UploadDoc() {

    const [textInput, setTextInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value);
    };
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleUpload = () => {
        console.log('Uploading...');

        // TODO: Upload the file to the server

        // const formData = new FormData();

        // if (selectedFile) {
        //     // Add the selected file to the FormData object
        //     formData.append('file', selectedFile);
        // } else if (textInput) {
        //     // Add the text input to the FormData object
        //     formData.append('text', textInput);
        // }

        // // Add the selected option to the FormData object
        // formData.append('option', selectedJsonFile);

        // // Make a POST request to the Flask API
        // axios.post('http://127.0.0.1:5000/api/post', formData)
        //     .then(response => {
        //         console.log(response.data);
        //         setProcessedData(response.data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
    };

    return (
        <div>
            <Typography variant="h3" sx={{ margin: '30px' }}>Upload Document</Typography>
            <Grid container spacing={2} alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h6">
                        Paste the Text or upload a file:
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile && !textInput}
                        startIcon={<UploadIcon />}
                        style={{ backgroundColor: '#F57C33', color: 'white' }}
                    >
                        Upload
                    </Button>
                </Grid>
            </Grid>

        </div>
    )
}
