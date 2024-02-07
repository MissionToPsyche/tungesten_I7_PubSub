import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Mainpage } from './Main/Mainpage'

import { MuiNavbar } from './navbar/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MuiNavbar></MuiNavbar>
      <Mainpage></Mainpage>
    </>
  )
}

export default App
