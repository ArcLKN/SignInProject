import {
	Box,
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
	Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables.jsx";
import { useState } from "react";

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

	const [tempProjectFiles, setTempProjectFiles] = useState([]);
	const [activeImage, setActiveImage] = useState(null);

	const tempNewProjectSlider = "";

	function handleFileUpload(data) {
		const file = data.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const dataUrl = reader.result;
				const newTempProjectFiles = [...tempProjectFiles, dataUrl];
				setTempProjectFiles(newTempProjectFiles);
				console.log(newTempProjectFiles);
			};
			reader.readAsDataURL(file);
		}
	}

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
						<Flex direction={"row"}>
							<Flex direction={"column"}>
								<FormLabel>Project Images</FormLabel>
								<Input
									hidden
									type='file'
									accept='image/*'
									onChange={(data) => handleFileUpload(data)}
								/>
								<Box>
									<Button
										onClick={() =>
											document
												.querySelector(
													'input[type="file"]'
												)
												.click()
										}
									>
										Upload
									</Button>
								</Box>
							</Flex>
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
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
