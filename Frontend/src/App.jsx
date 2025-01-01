import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Login from './Component/Login'
import Dashboard from './Component/DashBoard'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
