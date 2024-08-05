import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Center,
	Flex,
	Box,
	Text,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import {
	getUserProjects,
	deleteProjectFromId,
} from "../api/ProjectsRoutes.jsx";
import NavBar from "../components/navBar.jsx";
import CreateProjectModal from "../components/createProjectModal.jsx";
import ProjectsMainGrid from "../components/projectsMainGrid.jsx";

export default function Projects() {
	const navigate = useNavigate();
	const [doCreateProjectModalIsOpen, setDoCreateProjectModalIsOpen] =
		useState(false);
	const [userProjects, setUserProjects] = useState([]);

	//const [sortedProjects, setSortedProjects] = useState([]);

	useEffect(() => {
		const fetchUserProjects = async () => {
			try {
				const projects = await getUserProjects();
				if (projects.data) setUserProjects(projects.data);
				else navigate("/sign-in");
				console.log(projects.data);
			} catch (error) {
				console.error(
					"There was an error fetching user projects!",
					error
				);
				navigate("/sign-in");
			}
		};

		fetchUserProjects();
	}, []);

	async function deleteProject(projectId) {
		console.log("SHOULD BE DELETING", projectId);
		const response = await deleteProjectFromId(projectId);
		if (response.msg) {
			console.log(response);
			const newProjects = userProjects.filter(
				(project) => project._id !== projectId
			);
			setUserProjects(newProjects);
		}
	}

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
								<ProjectsMainGrid
									userProjects={userProjects}
									deleteProject={deleteProject}
								/>
							</Flex>
						</Box>
					</Box>
				</Flex>
			</Center>
		</>
	);
}
