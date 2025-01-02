import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Login from './Component/Login'
import Dashboard from './Component/DashBoard'
import AllStatus from './Component/Allstatus'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/all' element={<AllStatus />} />
      </Routes>
    </Router>
  )
}

export default App
