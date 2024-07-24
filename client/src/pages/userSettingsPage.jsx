import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink, FormLabel, HStack } from "@chakra-ui/react";
import {
	Button,
	Input,
	Center,
	Flex,
	Box,
	Text,
	Image,
} from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg, base64ToBlob } from "../utils/canvaUtils.jsx";
import { updateSelfData, getSelfData } from "../api/UserRoutes.jsx";
import imageCompression from "browser-image-compression";

const PATTERN = {
	name: /^[\w -]{4,100}$/i,
};

export default function UserSettings() {
	const [userName, setUserName] = useState({
		firstName: "Unknown",
		lastName: "Unknown",
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			firstName: userName.firstName,
			lastName: userName.lastName,
		},
	});

	const [isCropping, setIsCropping] = useState(false);

	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const [profilePictureSrc, setProfilePictureSrc] = useState("");
	const [newProfilePictureSrc, setNewProfilePictureSrc] = useState(null);
	const [editedProfilePicture, setEditedProfilePicture] = useState(null);

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
					reset({
						firstName: json.msg.firstName,
						lastName: json.msg.lastName,
					});
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		const getUserProfilePicture = async () => {
			try {
				const response = await getSelfData("socialPicture");
				const imageUrl = `http://localhost:3001/images/${response.key}`;
				console.log("imageUrl", imageUrl, response.key);
				setProfilePictureSrc(imageUrl);
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		getUserProfilePicture();
		getUserName();
	}, [reset]);

	async function handleCropSave(croppedArea, croppedAreaPixels) {
		try {
			const croppedImage = await getCroppedImg(
				newProfilePictureSrc,
				croppedAreaPixels
			);
			setEditedProfilePicture(croppedImage);
		} catch (e) {
			console.error(e);
		}
	}

	function handleProfilePictureChange(e) {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const dataUrl = reader.result;
				setNewProfilePictureSrc(dataUrl);
				setEditedProfilePicture(dataUrl);
				sessionStorage.setItem("tempProfilePicture", dataUrl);
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleUpdateData(data) {
		try {
			const formData = new FormData();
			if (editedProfilePicture) {
				const blob = await base64ToBlob(
					editedProfilePicture,
					"image/jpeg"
				);
				const compressedImage = await imageCompression(blob, {
					maxSizeMB: 1,
					maxWidthOrHeight: 1024,
					useWebWorker: true,
				});

				// Convert the compressed image to a Base64 string
				const base64data = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(compressedImage);
					reader.onloadend = () => resolve(reader.result);
					reader.onerror = (error) => reject(error);
				});

				const response = await getSelfData("id");
				const userId = response.key;
				const fileName = `profilePicture_${userId}.jpg`;
				const file = new File([compressedImage], fileName, {
					type: "image/jpeg",
				});

				formData.append("file", file);

				setProfilePictureSrc(base64data);
				localStorage.setItem("profilePicture", base64data);
				setNewProfilePictureSrc(null);
				setEditedProfilePicture(null);
			}

			formData.append("firstName", data.firstName);
			formData.append("lastName", data.lastName);

			await updateSelfData(formData);
		} catch (error) {
			console.error("Error in handleUpdateData:", error);
		}
	}

	async function removeProfilePicture() {
		setNewProfilePictureSrc(null);
		setEditedProfilePicture(null);
		setProfilePictureSrc(null);
		updateSelfData({ socialPicture: null });
	}

	return (
		<>
			<title>User Settings</title>
			{isCropping && (
				<Center h='100vh' w='100vw'>
					<Box className='crop-container'>
						<Cropper
							image={newProfilePictureSrc}
							crop={crop}
							zoom={zoom}
							aspect={1}
							onCropChange={setCrop}
							onCropComplete={handleCropSave}
							onZoomChange={setZoom}
						/>
						<Button
							position='absolute'
							bottom={"50px"}
							onClick={() => setIsCropping(!isCropping)}
						>
							Save
						</Button>
					</Box>
				</Center>
			)}
			{!isCropping && (
				<>
					<ChakraLink as={ReactRouterLink} to='/users'>
						<Button
							rounded={"0px"}
							w='100%'
							colorScheme={colors.mainColor}
							bgColor='teal.300'
							mb='50px'
						>
							Return
						</Button>
					</ChakraLink>
					<Center h='80vh' w='100wh' overflow={"hidden"}>
						<Flex direction={"row"}>
							<Flex direction={"column"} m={"10px"}>
								<Box>
									<Text fontSize='40px'>User Settings</Text>
								</Box>
								<Box>
									<Flex>
										<Image
											boxSize='200px'
											objectFit='cover'
											src={profilePictureSrc}
											alt='Profile Picture'
										/>
									</Flex>
									<Box mt='10px'>
										<form
											onSubmit={handleSubmit((data) => {
												handleUpdateData(data);
											})}
										>
											<Flex direction={"column"}>
												<Input
													hidden
													type='file'
													accept='image/*'
													onChange={
														handleProfilePictureChange
													}
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
														<Button
															onClick={
																removeProfilePicture
															}
															backgroundColor={
																colors.redError
															}
														>
															Remove
														</Button>
													</HStack>
												</Box>
												<FormLabel mt='10px'>
													First Name
												</FormLabel>
												<Input
													{...register("firstName", {
														required:
															"First name is required.",
														minLength: {
															value: 4,
															message:
																"Min length is 4.",
														},
														maxLength: {
															value: 100,
															message:
																"Max length is 100.",
														},
														pattern: {
															value: PATTERN.name,
															message:
																"Should only contain alphanumerical characters.",
														},
													})}
													placeholder='First Name'
												/>
												<Text color={colors.redError}>
													{errors.firstName?.message}
												</Text>
												<FormLabel mt='10px'>
													Last Name
												</FormLabel>
												<Input
													{...register("lastName", {
														required:
															"Last name is required.",
														minLength: {
															value: 4,
															message:
																"Min length is 4.",
														},
														maxLength: {
															value: 100,
															message:
																"Max length is 100.",
														},
														pattern: {
															value: PATTERN.name,
															message:
																"Should only contain alphanumerical characters.",
														},
													})}
													placeholder='Last Name'
												/>
												<Text color={colors.redError}>
													{errors.lastName?.message}
												</Text>
												<Input
													color='white'
													mt='10px'
													type='submit'
													bgColor='teal'
												/>
											</Flex>
										</form>
									</Box>
								</Box>
							</Flex>
							{newProfilePictureSrc && (
								<Center ml='100px'>
									<Flex direction={"column"}>
										<Box>
											<Image
												boxSize='35vw'
												objectFit='cover'
												src={editedProfilePicture}
												alt='New Profile Picture'
											/>
										</Box>
										<Box>
											<Button
												onClick={() =>
													setIsCropping(!isCropping)
												}
											>
												Edit image
											</Button>
										</Box>
									</Flex>
								</Center>
							)}
						</Flex>
					</Center>
				</>
			)}
		</>
	);
}
