import { HStack, SimpleGrid } from "@chakra-ui/react";
import UsersEmptyState from "../components/usersEmptyState.jsx";
import ProjectGridImage from "./projectGridImage.jsx";

export default function ProjectsMainGrid({ userProjects, deleteProject }) {
	return (
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
						<ProjectGridImage
							key={project._id}
							project={project}
							deleteProject={deleteProject}
						/>
					))}
				</SimpleGrid>
			) : (
				<UsersEmptyState />
			)}
		</HStack>
	);
}
