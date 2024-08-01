import { Flex, Box, Text, HStack, Image, SimpleGrid } from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import UsersEmptyState from "../components/usersEmptyState.jsx";
import { useNavigate } from "react-router-dom";

export default function ProjectsMainGrid({ userProjects }) {
	const navigate = useNavigate();
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
							<Flex alignItems='center' justify='center'>
								<Image
									src={`http://localhost:3001/images/${project.images[0]}`}
									rounded='5px'
									boxSize='170px'
									w='300px'
									objectFit='cover'
								/>
							</Flex>
							<Text fontWeight='bold' noOfLines={1}>
								{project.title}
							</Text>
						</Box>
					))}
				</SimpleGrid>
			) : (
				<UsersEmptyState />
			)}
		</HStack>
	);
}
