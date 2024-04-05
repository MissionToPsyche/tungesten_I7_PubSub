import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Mainpage } from './components/Mainpage'
import { MuiNavbar } from './components/Navbar'
import Login from "./components/Login"
import './App.css';
import AddUser from './components/AddUser';
import Dashboard from './components/Dashboard';
import Publications from './components/Publications';
import { UploadDoc } from './components/UploadDoc';
import Publication from './components/Publication';
import ViewPDF from './components/viewPDF';
import axios from 'axios';
// import UpdateUser from './components/UpdateUser';
// import AuthProvider from './providers/AuthProvider';
// import RoutesComp from './routes/RoutesComp';
import User from './subComponents/Users/User';
import TeamProfile from './subComponents/Teams/TeamProfile';

function RoutesComponent() {
  const [user, setUser] = useState(null);

  const init = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = await axios.get('http://localhost:3000/auth/current-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(user.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }


  useEffect(() => {
    init();
  }
    , []);

  // useEffect(() => {
  //   // Check if the user information is present in the localStorage
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   } else {
  //     // If the user information is not present, fetch the user data from the server
  //     const token = localStorage.getItem('token');
  //     axios.get('http://localhost:3000/auth/current-user', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((response) => {
  //         setUser(response.data);
  //         // Store the user information in the localStorage
  //         localStorage.setItem('user', JSON.stringify(response.data));
  //       })
  //       .catch((error) => {
  //         console.error('Failed to fetch user:', error);
  //         navigate('/login');
  //       });
  //   }
  //   console.log(user);
  // }, [navigate]);

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  return <></>
}
function App() {

  return (
    <div>
      <Router>
        <MuiNavbar />
        <RoutesComponent />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adduser/" element={<AddUser />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/publications/" element={<Publications />} />
          <Route path="/document/:id" element={<Publication />} />
          <Route path="/uploaddoc/" element={<UploadDoc />} />
          <Route path="/ViewPDF/" element={<ViewPDF />} />
          <Route path="/profile/:id" element={<User />} />
          <Route path="/team/:id" element={<TeamProfile />} />
        </Routes>
      </Router>
    </div>
    // <AuthProvider>
    // 	{/* <MuiNavbar /> */}
    //     <RoutesComp />
    //   </AuthProvider>

  )
}


export default App
