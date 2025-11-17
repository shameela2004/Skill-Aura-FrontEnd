import React from 'react'
import AppRoutes from './routes'
import { ToastContainer } from "react-toastify";



function App() {
  return (
    <>
    <AppRoutes></AppRoutes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App