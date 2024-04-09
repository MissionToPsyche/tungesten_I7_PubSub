/* eslint-disable react/prop-types */
import { useState } from "react";
import { NewUser } from "../subComponents/Users/NewUser";
import { ManageUsers } from "../subComponents/Users/ManageUsers";
import { ManageTeams } from "../subComponents/Teams/ManageTeams";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import { NewTeam } from "../subComponents/Teams/NewTeams";
import { UploadDoc } from "./UploadDoc";
import ListDocs from "../subComponents/document/ListDocs";

function Dashboard() {
    const [value, setValue] = useState(0);
    const [tabValue1, setTabValue1] = useState(0);
    const [tabValue2, setTabValue2] = useState(0);
    const [tabValue3, setTabValue3] = useState(0);

    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.user.role : '';

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleNestChange = (event, newValue) => {
        setTabValue1(newValue);
    };

    const handleTab2Change = (event, newValue) => {
        setTabValue2(newValue);
    };

    const handleTab3Change = (event, newValue) => {
        setTabValue3(newValue);
    };


    return (
        <div>
            <Typography variant="h3" sx={{ margin: "30px" }}>{userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</Typography>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        {userRole === 'admin' && <Tab label="Users" />}
                        {userRole === 'admin' && <Tab label="Teams" />}
                        <Tab label="Documents" />
                    </Tabs>
                </Box>
                {userRole === 'admin' && (
                    <TabPanel value={value} index={0}>
                        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                            <Tabs value={tabValue1} onChange={handleNestChange} orientation="vertical" variant="scrollable" sx={{ borderRight: 1, borderColor: 'divider', width: '20%' }}>
                                <Tab label="Add New User" />
                                <Tab label="List Users" />
                            </Tabs>
                            <Box sx={{ width: '80%' }}>
                                <TabPanel value={tabValue1} index={0}>
                                    <NewUser />
                                </TabPanel>
                                <TabPanel value={tabValue1} index={1}>
                                    <ManageUsers />
                                </TabPanel>
                            </Box>
                        </Box>
                    </TabPanel>
                )}
                {userRole === 'admin' && (
                    <TabPanel value={value} index={1}>
                        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                            <Tabs value={tabValue2} onChange={handleTab2Change} orientation="vertical" variant="scrollable" sx={{ borderRight: 1, borderColor: 'divider', width: '20%' }}>
                                <Tab label="Add New Team" />
                                <Tab label="List Teams" />
                            </Tabs>
                            <Box sx={{ width: '80%' }}>
                                <TabPanel value={tabValue2} index={0}>
                                    <NewTeam />
                                </TabPanel>
                                <TabPanel value={tabValue2} index={1}>
                                    <ManageTeams />
                                </TabPanel>
                            </Box>
                        </Box>
                    </TabPanel>
                )}
                <TabPanel value={value} index={userRole === 'admin' ? 2 : 0}>
                    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                        <Tabs value={tabValue3} onChange={handleTab3Change} orientation="vertical" variant="scrollable" sx={{ borderRight: 1, borderColor: 'divider', width: '20%' }}>
                            <Tab label="Add New Document" />
                            <Tab label="List Documents" />
                        </Tabs>
                        <Box sx={{ width: '80%' }}>
                            <TabPanel value={tabValue3} index={0}>
                                <UploadDoc showHeader={false} />
                            </TabPanel>
                            <TabPanel value={tabValue3} index={1}>
                                <ListDocs />
                            </TabPanel>
                        </Box>
                    </Box>
                </TabPanel>
            </Box>
        </div>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default Dashboard;
