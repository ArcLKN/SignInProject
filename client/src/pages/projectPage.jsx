import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Center,
	Flex,
	Box,
	VStack,
	useBreakpointValue,
	Button,
} from "@chakra-ui/react";

import {
	getProjectFromId,
	updateProjectFromId,
} from "../api/ProjectsRoutes.jsx";
import NavBar from "../components/navBar.jsx";
import ProjectImageGallery from "../components/projectImageGallery.jsx";
import ProjectThumbnailsSliderBox from "../components/projectThumbnailsSliderBox.jsx";
import ProjectInformations from "../components/projectInformations.jsx";
import ProjectThumbnailsBoard from "../components/projectThumbnailsBoard.jsx";

export default function Project() {
	const navigate = useNavigate();
	const { title } = useParams();
	const [sliderIndex, setSliderIndex] = useState(0);
	const [editThumbnailsSlider, setEditThumbnailsSlider] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isOwner, setIsOwner] = useState(false);

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
		console.log("project.images has changed:", project.images);
		const checkAdmin = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				return;
			}
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/isAdmin/${token}`,
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
					setIsAdmin(true);
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		const checkOwner = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				return;
			}
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/project/check-owner/${projectId}`,
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
				if (json.data) {
					setIsOwner(json.data);
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		checkAdmin();
		checkOwner();
	}, [project.images, projectId]);

	async function changeImageOrder(toBeReplacedImage, toReplaceImage) {
		//console.log("Initial project.images:", project.images);
		const index1 = project.images.findIndex(
			(item) => item === toBeReplacedImage
		);
		const index2 = project.images.findIndex(
			(item) => item === toReplaceImage
		);
		const newImageList = [...project.images];

		//console.log("old list", newImageList);

		if (index1 !== -1 && index2 !== -1) {
			[newImageList[index1], newImageList[index2]] = [
				newImageList[index2],
				newImageList[index1],
			];
		}

		/*
		console.log(
			"IMAGES",
			toBeReplacedImage,
			index1,
			toReplaceImage,
			index2
		);*/

		const response = await updateProjectFromId(projectId, {
			images: newImageList,
		});

		if (response.error) {
			console.error("Error updating project:", response.error);
			return newImageList;
		}

		const updatedProject = { ...project, images: newImageList };
		setProject(updatedProject);
		//console.log("Updated project:", updatedProject);
		setEditThumbnailsSlider(false);
		return newImageList;
	}

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

	const isMobile = useBreakpointValue(
		{ base: true, md: false },
		{ fallback: "md" }
	);

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
										{project.images.length > 1 &&
											(editThumbnailsSlider ? (
												<Box
													border='2px solid red'
													rounded={"5px"}
												>
													<ProjectThumbnailsBoard
														project={project}
														changeImageOrder={
															changeImageOrder
														}
													/>
												</Box>
											) : (
												<ProjectThumbnailsSliderBox
													project={project}
													index={sliderIndex}
													setIndex={setSliderIndex}
												/>
											))}
									</VStack>
									{(isOwner || isAdmin) && !isMobile && (
										<Button
											onClick={() =>
												setEditThumbnailsSlider(
													!editThumbnailsSlider
												)
											}
										>
											Edit order
										</Button>
									)}
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
