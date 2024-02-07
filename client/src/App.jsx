import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Mainpage } from './components/Main/Mainpage'
import { MuiNavbar } from './components/navbar/Navbar'
import Login from "./components/Login/Login"
import './App.css';

function App() {

  return (
    <div>
      <Router>
        <MuiNavbar />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App
