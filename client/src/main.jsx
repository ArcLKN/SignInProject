import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/loginPage.jsx";
import Users from "./pages/usersPage.jsx";
import Home from "./pages/homePage.jsx";
import SignUp from "./pages/signUpPage.jsx";
import UserSettings from "./pages/userSettingsPage.jsx";
import ConfirmAccount from "./components/confirmAccount.jsx";
import Projects from "./pages/projects.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/users",
		element: <Users />,
	},
	{
		path: "/sign-in",
		element: <Login />,
	},
	{
		path: "/sign-up",
		element: <SignUp />,
	},
	{
		path: "/user-settings",
		element: <UserSettings />,
	},
	{
		path: "/confirm/:token",
		element: <ConfirmAccount />,
	},
	{
		path: "/projects",
		element: <Projects />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<ChakraProvider>
		<RouterProvider router={router} />
	</ChakraProvider>
);
