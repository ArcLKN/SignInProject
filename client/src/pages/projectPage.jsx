import { useState, useEffect } from "react";
import {
	useNavigate,
	useParams,
	Link as ReactRouterLink,
} from "react-router-dom";
import {
	Button,
	Center,
	Flex,
	Box,
	Text,
	HStack,
	VStack,
	Avatar,
	Image,
	Link as ChakraLink,
	Checkbox,
	Input,
	useBreakpointValue,
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { getProjectFromId } from "../api/ProjectsRoutes.jsx";
import NavBar from "../components/navBar.jsx";

export default function Project() {
	const { title } = useParams();

	function extractIdFromTitle(title) {
		const parts = title.split("-");
		return parts[parts.length - 1];
	}
	const projectId = extractIdFromTitle(title);

	const [project, setProject] = useState({
		owner: "Unknown",
		title: title,
		description: "No description...",
		images: null,
	});

	const [actualImage, setActualImage] = useState(0);
	const [imageOffset, setImageOffset] = useState(0);

	useEffect(() => {
		const fetchProjectInformations = async () => {
			try {
				const result = await getProjectFromId(projectId);
				setProject({
					owner: result.data.owner,
					title: result.data.title,
					description: result.data.description,
					images: result.data.images,
				});
				console.log("project", project);
			} catch (error) {
				console.error("There was an error fetching project!", error);
				navigate("/sign-in");
			}
		};
		fetchProjectInformations();
	}, []);

	const paddingXValue = useBreakpointValue({ base: "0", md: "48" });
	const paddingYValue = useBreakpointValue({ base: "0", md: "16" });
	const mainflexDirection = useBreakpointValue({ base: "column", md: "row" });
	const paddingTextBox = useBreakpointValue({ base: "4", md: "10" });
	const imageWidth = useBreakpointValue({ base: "100%", md: "600px" });
	const scrollerOverflowX = useBreakpointValue({
		base: "auto",
		md: "hidden",
	});

	const handleThumbnailClick = (i) => {
		const container = document.querySelector(".bigImageContainer");
		const width = document.querySelector(".big-image").clientWidth;
		container.scrollTo({ left: i * width, top: 0, behavior: "smooth" });
		//setImageOffset(i * -width);
	};

	return (
		<>
			<title>{title}</title>
			<NavBar />
			<Center>
				<Flex direction={"column"} h='100%' w='100%'>
					<Box
						pl={paddingXValue}
						pr={paddingXValue}
						pt={paddingYValue}
						pb={paddingYValue}
					>
						<Flex
							direction={mainflexDirection}
							alignItems='flex-start'
						>
							{project.images && (
								<Flex
									direction={"column"}
									alignItems={"center"}
								>
									<VStack spacing={"3"}>
										<Box
											className='bigImageContainer'
											overflowX={scrollerOverflowX}
											cursor='auto'
										>
											<Flex>
												{project.images.map(
													(image, i) => (
														<Image
															key={"big_" + i}
															className='big-image'
															boxSize='437px'
															w={imageWidth}
															left={
																imageOffset +
																"px"
															}
															pos={"relative"}
															objectFit='cover'
															src={`http://localhost:3001/images/${image}`}
															onClick={() =>
																setActualImage(
																	i
																)
															}
															alt={`Thumbnail ${i}`}
															cursor='pointer'
														/>
													)
												)}
											</Flex>
										</Box>
										<Flex direction={"row"}>
											<HStack spacing={"1"}>
												{project.images.map(
													(image, i) => (
														<Image
															key={"small_" + i}
															boxSize='62px'
															objectFit='cover'
															src={`http://localhost:3001/images/${image}`}
															onClick={() =>
																handleThumbnailClick(
																	i
																)
															}
															alt={`Thumbnail ${i}`}
															cursor='pointer'
														/>
													)
												)}
											</HStack>
										</Flex>
									</VStack>
								</Flex>
							)}
							<Box maxW={"500px"} p={paddingTextBox}>
								<Flex direction={"column"} w='100%'>
									<VStack
										alignItems='flex-start'
										spacing={"10"}
										w='100%'
									>
										<VStack
											spacing={"5"}
											alignItems='flex-start'
										>
											<Text
												fontSize={"32px"}
												fontWeight={"bold"}
											>
												{project.title}
											</Text>
											<Text>{project.description}</Text>
										</VStack>
										<VStack
											spacing={"5"}
											alignItems='flex-start'
											w='100%'
										>
											<Input w='100%' />
											<Flex direction={"row"}>
												<Checkbox />
												<Text>
													Get the latest innovations
													straight to your inbox.
												</Text>
											</Flex>
											<Button
												colorScheme='teal'
												bgColor={colors.accentColor}
												w='100%'
											>
												Claim Your Early Access
											</Button>
										</VStack>
									</VStack>
								</Flex>
							</Box>
						</Flex>
					</Box>
				</Flex>
			</Center>
		</>
	);
}
