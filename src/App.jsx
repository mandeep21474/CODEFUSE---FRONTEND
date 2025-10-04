import React from 'react'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Editorpage from './pages/Editorpage';
import Landingpage from './pages/Landingpage';




const App = () => {
  let route = createBrowserRouter([
    {
      path: '/',
      element: <Landingpage/>
    },
    {
      path: '/home',
      element: <Home/>
    },
    {
      path: '/editor/:roomId',
      element: <Editorpage/>
    },
    
  ]);
  return (
    
      <RouterProvider router={route}/>
      
    
  )
}

export default App