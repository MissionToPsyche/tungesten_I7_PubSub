import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Mainpage } from './components/Mainpage'
import { MuiNavbar } from './components/Navbar'
import Login from "./components/Login"
import './App.css';
import AddUser from './components/AddUser';
import Dashboard from './components/Dashboard';
import Publications from './components/Publications';
import UploadDoc from './components/UploadDoc';
import UpdateUser from './components/UpdateUser';
import AuthProvider from './providers/AuthProvider';
import RoutesComp from './routes/RoutesComp';

function App() {

  return (
	<AuthProvider>
		{/* <MuiNavbar /> */}
      <RoutesComp />
    </AuthProvider>
    // <div>
    //   <Router>
    //     <MuiNavbar />
    //     <Routes>
    //       <Route path="/" element={<Mainpage />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/adduser/" element={<AddUser />} />
    //       <Route path="/updateUser/" element={<UpdateUser />} />
    //       <Route path="/dashboard/" element={<Dashboard />} />
    //       <Route path="/publications/" element={<Publications />} />
    //       <Route path="/uploaddoc/" element={<UploadDoc />} />
    //     </Routes>
    //   </Router>
    // </div>

  )
}

export default App
