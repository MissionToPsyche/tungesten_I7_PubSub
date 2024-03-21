import { useEffect } from 'react';
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
// import UpdateUser from './components/UpdateUser';
// import AuthProvider from './providers/AuthProvider';
// import RoutesComp from './routes/RoutesComp';
// import User from './subComponents/Users/User';

function RoutesComponent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={user ? <Mainpage /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adduser/" element={<AddUser />} />
      <Route path="/dashboard/" element={<Dashboard />} />
      <Route path="/publications/" element={<Publications />} />
      <Route path="/document/:id" element={<Publication />} />
      <Route path="/uploaddoc/" element={<UploadDoc />} />
      <Route path="/ViewPDF/" element={<ViewPDF />} />
    </Routes>
  );
}
function App() {

  return (
    <div>
      <Router>
        <MuiNavbar />
        <RoutesComponent />
      </Router>
    </div>
    // <AuthProvider>
    // 	{/* <MuiNavbar /> */}
    //     <RoutesComp />
    //   </AuthProvider>

  )
}


export default App
