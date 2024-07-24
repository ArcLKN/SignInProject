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
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { getSelfData } from "../api/UserRoutes.jsx";

export default function Projects() {
	const [userProfilePicture, setUserProfilePicture] = useState(null);
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
		const getUserProfilePicture = async () => {
			try {
				const response = await getSelfData("socialPicture");
				if (response.key) {
					const imageUrl = `http://localhost:3001/images/${response.key}`;
					console.log("imageUrl", imageUrl, response.key);
					setUserProfilePicture(imageUrl);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		getUserProfilePicture();
		getUserName();
	});

	function logout() {
		localStorage.removeItem("token");
		window.location.reload();
	}

	return (
		<>
			<title>Projects</title>
			<Center h='100vh' w='100wh'>
				<Flex direction={"column"} h='100%'>
					<Box mb='5'>
						<Flex align='center' justify={"space-between"}>
							<Flex align={"center"}>
								<HStack spacing='24px'>
									<Button onClick={logout}>Logout</Button>
									<ChakraLink
										as={ReactRouterLink}
										to='/user-settings'
									>
										<Avatar
											name={`${userName.firstName} ${userName.lastName}`}
											src={userProfilePicture}
										/>
									</ChakraLink>
								</HStack>
							</Flex>
						</Flex>
					</Box>
				</Flex>
			</Center>
			;
		</>
	);
}
