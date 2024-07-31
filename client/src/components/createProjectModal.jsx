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
	Image,
	Textarea,
	Button,
	IconButton,
	HStack,
} from "@chakra-ui/react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DeleteIcon,
} from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables.jsx";
import { useState } from "react";
import { createNewProject } from "../api/ProjectsRoutes.jsx";
import { base64ToBlob } from "../utils/canvaUtils.jsx";
import imageCompression from "browser-image-compression";

export default function CreateProjectModal({
	isOpen,
	doOpen,
	setUserProjects,
}) {
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
	const [activeImage, setActiveImage] = useState(0);

	const tempNewProjectSlider = "";

	async function uploadNewProject(data) {
		let convertedFiles = [];
		if (!Array.isArray(tempProjectFiles) || tempProjectFiles.length === 0) {
			console.log("Need image");
			return;
		}
		const formData = new FormData();
		for (let i = 0; i < tempProjectFiles.length; i++) {
			try {
				const blob = await base64ToBlob(
					tempProjectFiles[i],
					"image/jpeg"
				);
				const compressedImage = await imageCompression(blob, {
					maxSizeMB: 2,
					maxWidthOrHeight: 2048,
					useWebWorker: true,
				});
				const fileName = `projectImage_${i}.jpg`;
				const file = new File([compressedImage], fileName, {
					type: "image/jpeg",
				});
				convertedFiles.push(file);
			} catch (error) {
				console.error(`Error processing file ${i}:`, error);
			}
		}

		convertedFiles.forEach((file) => formData.append("files", file));
		formData.append("title", data.title);
		formData.append("description", data.description);
		try {
			const response = await createNewProject(formData);
			if (
				response &&
				response.data &&
				response.data.path &&
				response.data.id
			) {
				//consst newUserProjects = ...prev
				setUserProjects((prev) => {
					const newUserProjects = [...prev];
					newUserProjects.push({
						title: data.title,
						description: data.description,
						owner: "Unknown",
						images: [response.data.path],
						_id: response.data.id,
					});
					return newUserProjects;
				});
			}
		} catch (error) {
			console.error("Error creating new project:", error);
		}
	}

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

	const handleDeleteActiveImage = (index) => {
		// Remove the file at the specified index
		const newFiles = tempProjectFiles.filter((_, i) => i !== index);
		setTempProjectFiles(newFiles);

		// Optionally, update the activeImage index if necessary
		if (index === activeImage && activeImage > 0) {
			setActiveImage(activeImage - 1);
		} else if (index < activeImage) {
			setActiveImage(activeImage - 1);
		}
	};

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
							uploadNewProject(data);
						})}
					>
						<Flex direction={"row"}>
							<Flex direction={"column"} mr='4'>
								<FormLabel>Project Images</FormLabel>
								{Array.isArray(tempProjectFiles) &&
								tempProjectFiles.length > 0 ? (
									<Box>
										<Flex
											direction={"column"}
											alignItems={"center"}
										>
											<Box>
												<HStack>
													<Flex align={"center"}>
														<IconButton
															w='10px'
															h='100px'
															onClick={() =>
																setActiveImage(
																	Math.max(
																		activeImage -
																			1,
																		0
																	)
																)
															}
														>
															<ChevronLeftIcon />
														</IconButton>
														<Image
															boxSize='100px'
															objectFit='cover'
															src={
																tempProjectFiles[
																	activeImage
																]
															}
															alt='Profile Picture'
														/>
														<IconButton
															w='10px'
															h='100px'
															onClick={() =>
																setActiveImage(
																	Math.min(
																		activeImage +
																			1,
																		tempProjectFiles.length -
																			1
																	)
																)
															}
														>
															<ChevronRightIcon />
														</IconButton>
													</Flex>
												</HStack>
											</Box>
											<Text>{`${activeImage + 1}/${
												tempProjectFiles.length
											}`}</Text>
										</Flex>
									</Box>
								) : (
									<Text>No picture uploaded</Text> // Fallback UI
								)}

								<Input
									hidden
									type='file'
									accept='image/*'
									onChange={(data) => handleFileUpload(data)}
								/>
								<Box>
									<HStack>
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
										<IconButton
											onClick={() =>
												handleDeleteActiveImage(
													activeImage
												)
											}
										>
											<DeleteIcon />
										</IconButton>
									</HStack>
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
