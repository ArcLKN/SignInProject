import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
	Button,
	Flex,
	Box,
	Text,
	HStack,
	Avatar,
	Image,
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { getSelfData } from "../api/UserRoutes.jsx";

export default function NavBar() {
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
	}, []);

	function logout() {
		localStorage.removeItem("token");
		window.location.reload();
	}

	return (
		<Box
			w='100%'
			borderBottom={"1px solid"}
			borderColor={colors.ligrey}
			p='5px'
		>
			<Flex align='center' justify={"space-between"} w='100%'>
				<Box>
					<ChakraLink as={ReactRouterLink} to='/'>
						<Button bgColor={colors.bgColor}>
							<Flex align='center'>
								<Image
									src='../prelaunchLogo.png'
									width='30px'
								></Image>
								<Text
									ml='5px'
									fontWeight='bold'
									fontSize='20px'
								>
									Prelaunch.com
								</Text>
							</Flex>
						</Button>
					</ChakraLink>
				</Box>
				<Box w='30%'>
					<Flex direction={"row"} justify={"space-around"}>
						<ChakraLink as={ReactRouterLink} to='/users'>
							<Text fontWeight={"bold"}>Users</Text>
						</ChakraLink>
						<ChakraLink as={ReactRouterLink} to='/projects'>
							<Text fontWeight={"bold"}>Projects</Text>
						</ChakraLink>
					</Flex>
				</Box>
				<Box pr='15px'>
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
				</Box>
			</Flex>
		</Box>
	);
}
