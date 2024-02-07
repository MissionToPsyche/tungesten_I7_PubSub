import './App.css'
import NavBar from './components/NavBar'
import Home from './container/Home'
import About from './container/About'
import Dashboard from './container/Dashboard'
import UploadDoc from './container/UploadDoc'
import NotFound from './components/NotFound'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDoc />} />
          {/* TODO: <Route path="/login" element={<Login />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
