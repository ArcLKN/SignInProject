import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Center,
	Flex,
	Box,
	VStack,
	useBreakpointValue,
} from "@chakra-ui/react";

import { getProjectFromId } from "../api/ProjectsRoutes.jsx";
import NavBar from "../components/navBar.jsx";
import ProjectImageGallery from "../components/projectImageGallery.jsx";
import ProjectSliderThumbnails from "../components/projectSliderThumbnails.jsx";
import ProjectInformations from "../components/projectInformations.jsx";

export default function Project() {
	const navigate = useNavigate();
	const { title } = useParams();
	const [sliderIndex, setSliderIndex] = useState(0);

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
				//console.log("project", project);
			} catch (error) {
				console.error("There was an error fetching project!", error);
				navigate("/sign-in");
			}
		};
		fetchProjectInformations();
	}, [projectId, navigate]);

	// Modify style depending on device's size
	const paddingXValue = useBreakpointValue(
		{ base: "0", md: "48" },
		{ fallback: "md" }
	);
	const paddingYValue = useBreakpointValue(
		{ base: "0", md: "16" },
		{ fallback: "md" }
	);
	const mainflexDirection = useBreakpointValue(
		{ base: "column", md: "row" },
		{ fallback: "md" }
	);
	const paddingTextBox = useBreakpointValue(
		{ base: "4", md: "10" },
		{ fallback: "md" }
	);

	return (
		<>
			<title>{project.title}</title>
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
										<ProjectImageGallery
											project={project}
										/>
										<ProjectSliderThumbnails
											project={project}
											index={sliderIndex}
											setIndex={setSliderIndex}
										/>
									</VStack>
								</Flex>
							)}
							<Box maxW={"500px"} p={paddingTextBox}>
								<ProjectInformations project={project} />
							</Box>
						</Flex>
					</Box>
				</Flex>
			</Center>
		</>
	);
}
