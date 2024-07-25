import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
	Button,
	Center,
	Flex,
	Box,
	Text,
	HStack,
	Avatar,
	Image,
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { getSelfData } from "../api/UserRoutes.jsx";
import NavBar from "../components/navBar.jsx";

export default function Projects() {
	const [userName, setUserName] = useState({
		firstName: "Unknown",
		lastName: "Unknown",
	});

	useEffect(() => {
		const getUserName = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				return;
			}
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/getUserName/${token}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`${response.statusText}`);
				}
				const json = await response.json();
				if (json.msg) {
					setUserName({
						firstName: json.msg.firstName,
						lastName: json.msg.lastName,
					});
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};

		getUserName();
	}, []);

	return (
		<>
			<title>Projects</title>
			<Center>
				<Flex direction={"column"} h='100%' w='100%'>
					<NavBar />
				</Flex>
			</Center>
			;
		</>
	);
}
