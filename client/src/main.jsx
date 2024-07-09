import React from 'react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/loginPage.jsx'
import Users from './pages/usersPage.jsx'
import Home from './pages/homePage.jsx';
import SignUp from './pages/signUpPage.jsx';
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />
  },
  {
    path: "/sign-in",
    element: <Login />
  },
  {
    path: "/sign-up",
    element: <SignUp />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider>
    <RouterProvider router={router} />
    </ChakraProvider>
)
