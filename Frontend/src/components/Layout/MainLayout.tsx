// src/components/Layout/MainLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header' // Make sure the path to your Header is correct
import Footer from '../Footer' // Make sure the path to your Footer is correct

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        {/* The Outlet component will render the nested route's element */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
