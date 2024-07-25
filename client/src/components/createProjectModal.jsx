import {
	Text,
	Input,
	Flex,
	FormLabel,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Select,
	Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables.jsx";

export default function CreateProjectModal({ isOpen, doOpen, createProject }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
	});

	return (
		<Modal isOpen={isOpen} onClose={() => doOpen(false)}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create New Project</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form
						onSubmit={handleSubmit((data) => {
							doOpen(false);
						})}
					>
						<Flex direction='column'>
							<FormLabel>Project title</FormLabel>
							<Input
								{...register("title", {
									required: "Project title is required.",
									pattern: {
										value: /^[A-Za-z0-9 -_]+$/i,
										message:
											"Should only contain alphanumerical characters.",
									},
								})}
								placeholder='Project title'
							/>
							<FormLabel>Project description</FormLabel>
							<Textarea
								height={"10em"}
								type='text'
								{...register("description", {
									required:
										"Project description is required.",
									pattern: {
										value: /^[A-Za-z0-9 -_]+$/i,
										message:
											"Should only contain alphanumerical characters.",
									},
								})}
								placeholder='Project description...'
							/>
							<Input
								mt='5'
								bgColor='teal.300'
								color={"white"}
								_hover={{ bgColor: "teal.600" }}
								fontWeight={"bold"}
								type='submit'
								value='Create Project'
							/>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
