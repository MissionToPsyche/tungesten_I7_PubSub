import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Mainpage } from './components/Mainpage'
import { MuiNavbar } from './components/Navbar'
import Login from "./components/Login"
import './App.css';
import AddUser from './components/AddUser';
import Dashboard from './components/Dashboard';
import Publications from './components/Publications';
import UploadDoc from './components/UploadDoc';
import Publication from './components/Publication';

function App() {

  return (
    <div>
      <Router>
        <MuiNavbar />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adduser/" element={<AddUser />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/publications/" element={<Publications />} />
          <Route path="/publication/:pubId" element={<Publication />} />
          <Route path="/uploaddoc/" element={<UploadDoc />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App
