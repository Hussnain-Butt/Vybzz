import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import your actual pages
import Landing from './pages/Landing'
import GetToKnowYourListeners from './pages/Podcasters/GetToKnowYourListeners'

// Import the Header component
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Header /> {/* Header will be present on all pages */}
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Creator Pages */}
        <Route path="/creators/podcasters/listeners" element={<GetToKnowYourListeners />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
