import './App.css'
import NavBar from './components/NavBar'
import Home from './container/Home'
import About from './container/About'
import Dashboard from './container/Dashboard'
import UploadDoc from './container/UploadDoc'
import NotFound from './components/NotFound'
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="home" element={<Dashboard />} />
        <Route path="home" element={<UploadDoc />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
