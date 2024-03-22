/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Typography, CardMedia, Box, Grid, Card, CardContent, CircularProgress, Pagination } from "@mui/material";
import documents from '../assets/data/documents.json';
import axios from "axios";
// import Publication1 from "../assets/files/Publication1.pdf"
// import Publication2 from "../assets/files/Publication2.pdf"
// import Publication3 from "../assets/files/Publication3.pdf"
// import Publication4 from "../assets/files/Publication4.pdf"
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import docThumb from '../assets/images/docThumb.png';
// const files = {
//     "Exploring the depths": Publication1,
//     "Publication2": Publication2,
//     "Publication3": Publication3,
//     "Publication4": Publication4
// };


export default function Publications() {

    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        author: '',
        abstract: '',
        year: ''
    });

    // Add this function to handle filter changes
    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    const init = async () => {
        setIsLoading(true);
        // try {
        //     const res = await axios.get("http://localhost:3000/docs/fetchAll", {
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     });
        //     setPublications(res.data);
        //     // console.log(res.data);
        // } catch (error) {
        //     console.error('Error fetching documents:', error); // Log any errors
        // }
        try {
            // Get the documents string from localStorage
            const documentsString = localStorage.getItem('documents');

            // Check if the documents string is not null
            if (documentsString) {
                // Convert the documents string back into an object
                const documents = JSON.parse(documentsString);
                setPublications(documents);
            } else {
                throw new Error('No documents found in localStorage');
            }
        } catch (error) {
            console.error('Error fetching documents:', error); // Log any errors
        } finally {
            setIsLoading(false);
        }
    }

    // const searchDocs = async () => {
    //     setIsLoading(true);
    //     if (searchTerm) {
    //         try {
    //             let res;
    //             if (Object.values(filters).some(filter => filter)) {
    //                 const { author, abstract, year } = filters;
    //                 console.log(author, abstract, year);
    //                 res = await axios.get(`http://localhost:3000/search/byFilters?author=${author}&abstract=${abstract}&year=${year}`);
    //                 console.log("filters:", res);
    //             } else {
    //                 res = await axios.get(`http://localhost:3000/search/byTitle?substring=${searchTerm}`);
    //                 console.log("title", res);
    //             }
    //             setSearchResults(res.data);
    //         } catch (error) {
    //             console.error('Error searching documents:', error);
    //         }
    //     } else {
    //         setSearchResults([]);
    //     }
    //     setIsLoading(false);
    // };
    const searchDocs = () => {
        setIsLoading(true);
        if (searchTerm) {
            try {
                let res;
                const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
                if (Object.values(filters).some(filter => filter)) {
                    const { author, abstract, year } = filters;
                    const lowerCaseAuthor = author.toLowerCase().trim();
                    const lowerCaseAbstract = abstract.toLowerCase().trim();
                    res = documents.filter(doc =>
                        (author ? doc.user.username.toLowerCase().trim().includes(lowerCaseAuthor) : true) &&
                        (abstract ? doc.abstract.toLowerCase().trim().includes(lowerCaseAbstract) : true) &&
                        (year ? doc.yearPublished === year : true)
                    );
                    console.log("filters:", res);
                } else {
                    res = documents.filter(doc => doc.title.toLowerCase().trim().includes(lowerCaseSearchTerm));
                    console.log("title", res);
                }
                setSearchResults(res);
            } catch (error) {
                console.error('Error searching documents:', error);
            }
        } else {
            setSearchResults([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (searchTerm) {
            searchDocs();
        } else {
            init();
        }
    }, [searchTerm]);

    useEffect(() => {
        searchDocs();
    }, [filters]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <div>
            <Typography variant="h3" sx={{ margin: "30px" }}>Publications</Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" minHeight="100vh">
                <Box maxWidth={800} width="100%">
                    <TextField
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search Publications"
                        variant="outlined"
                        sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
                    />
                    {showFilters && (
                        <>
                            <TextField
                                name="author"
                                value={filters.author}
                                onChange={handleFilterChange}
                                placeholder="Filter by author"
                                variant="outlined"
                                sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
                            />
                            <TextField
                                name="abstract"
                                value={filters.abstract}
                                onChange={handleFilterChange}
                                placeholder="Filter by abstract"
                                variant="outlined"
                                sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
                            />
                            <TextField
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                placeholder="Filter by year"
                                variant="outlined"
                                sx={{ marginBottom: "20px", width: "40%" }}
                            />
                        </>
                    )}
                    <Button onClick={() => setShowFilters(!showFilters)}><MoreVertIcon />More</Button>
                    {isLoading ? (
                        <CircularProgress />
                    ) : searchTerm ? (
                        searchResults.length === 0 ? (
                            <Typography variant="h6" component="h4" align="center" gutterBottom> No documents found </Typography>
                        ) : (
                            // console.log(searchResults),
                            searchResults.map((publication) => (
                                <Publication publication={publication} key={publication.id} />
                            ))
                        )
                    ) : (
                        publications.length === 0 ? (
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
                        )
                    )}
                </Box>
            </Box>
        </div>
    )
}

function Publication({ publication }) {
    var { id, title, content, comments, adminAccess } = publication;
    const navigate = useNavigate();

    const handleOpenDoc = () => {
        navigate(`/document/${id}`);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "center", marginTop: 80 }}>
                <Card sx={{
                    width: 600, cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                }} onClick={handleOpenDoc}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={docThumb}
                        alt="Document thumbnail"
                    />
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>

                    </CardContent>
                </Card>
            </div>
        </div >
    )
}