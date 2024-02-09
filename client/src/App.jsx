import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Mainpage } from './components/Mainpage'
import { MuiNavbar } from './components/Navbar'
import Login from "./components/Login"
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
