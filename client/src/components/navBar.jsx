import { useState, useEffect } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { Link as ChakraLink, MenuDivider, MenuItem } from "@chakra-ui/react";
import {
	Button,
	Flex,
	Box,
	Text,
	HStack,
	Avatar,
	Image,
	Menu,
	MenuButton,
	Icon,
	MenuList,
	MenuGroup,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { BiLogOut, BiCog, BiFolder, BiGroup } from "react-icons/bi";
import { colors } from "../styleVariables.jsx";
import { getSelfData } from "../api/UserRoutes.jsx";

export default function NavBar() {
	const navigate = useNavigate();
	const [userProfilePicture, setUserProfilePicture] = useState(null);
	const [userName, setUserName] = useState({
		firstName: "Unknown",
		lastName: "Unknown",
	});
	const [userEmail, setUserEmail] = useState("example@email.com");

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
					//console.log("imageUrl", imageUrl, response.key);
					setUserProfilePicture(imageUrl);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		const getUserMail = async () => {
			try {
				const response = await getSelfData("email");
				if (response.key) {
					setUserEmail(response.key);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		getUserProfilePicture();
		getUserName();
		getUserMail();
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
			<Flex align='center' justify={"space-between"} w='100%' p='7px'>
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
				<Box pr='15px'>
					<Flex align={"center"}>
						<HStack spacing='24px'>
							<Menu>
								<MenuButton
									as={Button}
									bgColor={"white"}
									rounded='20px'
									border={"1px solid"}
									borderColor={colors.ligrey}
								>
									<Flex align='center' direction={"row"}>
										<HStack>
											<Icon>
												<HamburgerIcon />
											</Icon>
											<Avatar
												size='xs'
												name={`${userName.firstName} ${userName.lastName}`}
												src={userProfilePicture}
											/>
										</HStack>
									</Flex>
								</MenuButton>
								<MenuList zIndex='10' p='3'>
									<MenuItem
										_hover={{ bg: "transparent" }}
										_focus={{ bg: "transparent" }}
										pointerEvents='none'
										padding='12px'
										rounded='5px'
									>
										<HStack spacing={"24px"}>
											<Avatar
												name={`${userName.firstName} ${userName.lastName}`}
												src={userProfilePicture}
											/>
											<Flex direction={"column"}>
												<Text
													color={colors.dagrey}
													fontWeight={"bold"}
												>
													{userName.firstName}{" "}
													{userName.lastName}
												</Text>
												<Text color={colors.mgrey}>
													{userEmail}
												</Text>
											</Flex>
										</HStack>
									</MenuItem>
									<MenuItem
										padding='12px'
										rounded='5px'
										onClick={() =>
											navigate("/user-settings")
										}
									>
										<HStack spacing={"12px"}>
											<BiCog size={24} />
											<Text
												fontSize={"lg"}
												color={colors.dagrey}
											>
												Settings
											</Text>
										</HStack>
									</MenuItem>
									<MenuItem
										padding='12px'
										rounded='5px'
										onClick={() => navigate("/users")}
									>
										<HStack spacing={"12px"}>
											<BiGroup size={24} />
											<Text
												fontSize={"lg"}
												color={colors.dagrey}
											>
												Users
											</Text>
										</HStack>
									</MenuItem>
									<MenuItem
										padding='12px'
										rounded='5px'
										onClick={() => navigate("/projects")}
									>
										<HStack spacing={"12px"}>
											<BiFolder size={24} />
											<Text
												fontSize={"lg"}
												color={colors.dagrey}
											>
												Projects
											</Text>
										</HStack>
									</MenuItem>
									<MenuDivider />
									<MenuItem
										onClick={logout}
										padding='12px'
										rounded='5px'
									>
										<HStack spacing={"12px"}>
											<BiLogOut size={24} />
											<Text
												fontSize={"lg"}
												color={colors.dagrey}
											>
												Logout
											</Text>
										</HStack>
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
}
