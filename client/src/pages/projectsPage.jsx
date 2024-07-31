import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Center,
	Flex,
	Box,
	Text,
	HStack,
	Image,
	SimpleGrid,
	useBreakpointValue,
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { getUserProjects } from "../api/ProjectsRoutes.jsx";
import NavBar from "../components/navBar.jsx";
import CreateProjectModal from "../components/createProjectModal.jsx";
import UsersEmptyState from "../components/usersEmptyState.jsx";

export default function Projects() {
	const navigate = useNavigate();
	const [userName, setUserName] = useState({
		firstName: "Unknown",
		lastName: "Unknown",
	});
	const [doCreateProjectModalIsOpen, setDoCreateProjectModalIsOpen] =
		useState(false);
	const [userProjects, setUserProjects] = useState([]);
	//const [sortedProjects, setSortedProjects] = useState([]);

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
		const fetchUserProjects = async () => {
			try {
				const projects = await getUserProjects();
				if (projects.data) setUserProjects(projects.data);
				else navigate("/sign-in");
				//console.log(projects.data);
			} catch (error) {
				console.error(
					"There was an error fetching user projects!",
					error
				);
				navigate("/sign-in");
			}
		};

		fetchUserProjects();
		getUserName();
	}, []);

	const projectsMap = userProjects.map((project) => {
		<Text>{project.title}</Text>;
	});

	const paddingXValue = useBreakpointValue({ base: "2", md: "32" });
	const paddingYValue = useBreakpointValue({ base: "2", md: "8" });

	return (
		<>
			<title>Projects</title>
			{doCreateProjectModalIsOpen && (
				<CreateProjectModal
					isOpen={doCreateProjectModalIsOpen}
					doOpen={setDoCreateProjectModalIsOpen}
					setUserProjects={setUserProjects}
				/>
			)}
			<Center>
				<Flex direction={"column"} h='100%' w='100%'>
					<NavBar />
					<Box
						pt={paddingYValue}
						pb={paddingYValue}
						pr={paddingXValue}
						pl={paddingXValue}
						w='100%'
					>
						<Box>
							<Flex direction='row' justify='space-between'>
								<Text fontWeight={"bold"} fontSize={"2xl"}>
									Projects
								</Text>
								<Button
									colorScheme='teal'
									onClick={() =>
										setDoCreateProjectModalIsOpen(true)
									}
								>
									New Project
								</Button>
							</Flex>
						</Box>
						<Box mt='4'>
							<Flex justify='center'>
								<HStack spacing='24px'>
									{Object.keys(userProjects).length > 0 ? (
										<SimpleGrid
											columns={{
												base: 1,
												sm: 2,
												md: 3,
												lg: 4,
											}}
											spacing={10}
										>
											{userProjects.map((project) => (
												<Box
													key={project._id}
													border='1px solid'
													borderColor={colors.vligrey}
													rounded='5px'
													w='300px'
													h='210px'
													p='3'
													_hover={{
														boxShadow: "lg",
													}}
													onClick={() =>
														navigate(
															`/projects/${project.title}-${project._id}`
														)
													}
												>
													<Flex
														alignItems='center'
														justify='center'
													>
														<Image
															src={`http://localhost:3001/images/${project.images[0]}`}
															rounded='5px'
															boxSize='170px'
															w='300px'
															objectFit='cover'
														/>
													</Flex>
													<Text
														fontWeight='bold'
														noOfLines={1}
													>
														{project.title}
													</Text>
												</Box>
											))}
										</SimpleGrid>
									) : (
										<UsersEmptyState />
									)}
								</HStack>
							</Flex>
						</Box>
					</Box>
				</Flex>
			</Center>
		</>
	);
}
