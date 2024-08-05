import {
	Flex,
	Box,
	Text,
	Image,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { DeleteIcon } from "@chakra-ui/icons";
import DeleteProjectAlert from "./deleteProjectAlert.jsx";
import { useNavigate } from "react-router-dom";

export default function ProjectGridImage({ project, deleteProject }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();
	return (
		<Box
			position={"relative"}
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
		>
			<Flex alignItems='center' justify='center'>
				<Image
					src={`http://localhost:3001/images/${project.images[0]}`}
					rounded='5px'
					boxSize='170px'
					w='300px'
					objectFit='cover'
					onClick={() =>
						navigate(`/projects/${project.title}-${project._id}`)
					}
				/>
			</Flex>
			<Text fontWeight='bold' noOfLines={1}>
				{project.title}
			</Text>
			<IconButton
				bgColor='white'
				padding={"5px"}
				position='absolute'
				size={"m"}
				top='20px'
				right={"20px"}
				onClick={onOpen}
				icon={<DeleteIcon />}
				color='red'
			/>
			<DeleteProjectAlert
				isOpen={isOpen}
				onClose={onClose}
				deleteProject={deleteProject}
				projectId={project._id}
			/>
		</Box>
	);
}
