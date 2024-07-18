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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables.jsx";
import React, { useEffect, useState } from "react";

export default function EditUserModal({ isOpen, doOpen, editUser, userData }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: userData,
	});
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		reset(userData);
	}, [userData, reset]);

	const inputConfig = {
		createdAt: {
			name: "Created At",
			type: "date",
		},
		email: { name: "Email", type: "email", isForbidden: true },
		firstName: { name: "First Name", type: "text", isForbidden: true },
		lastName: { name: "Last Name", type: "text", isForbidden: true },
		userType: {
			name: "User Type",
			type: "select",
			isForbidden: true,
			doAdmin: true,
			options: [
				{ label: "User", value: "User" },
				{ label: "Admin", value: "Admin" },
				{ label: "Super Admin", value: "Super Admin" },
				{ label: "Moderator", value: "Moderator" },
				{ label: "Content Moderator", value: "Content Moderator" },
				{
					label: "Discussions Moderator",
					value: "Discussions Moderator",
				},
				{ label: "User Moderator", value: "User Moderator" },
				{ label: "Guest", value: "Guest" },
			],
		},
		projectsCollaboratorsCount: {
			name: "Projects Collaborators.",
			type: "number",
		},
		projectsCount: { name: "Projects Count", type: "number" },
		ideaProjectsCount: { name: "Idea Projects Count", type: "number" },
		reservationsCount: { name: "Reservations Count", type: "number" },
		socialPicture: { name: "Social Picture", type: "number" },
		subscriptionsCount: { name: "Subscriptions Count", type: "number" },
		signUpMethod: { name: "Sign Up Method" },
		stripeCustomedId: { name: "Stripe Customer ID", type: "text" },
		unseenSystemNotificationsCount: {
			name: "Unseen Notif.",
			type: "number",
		},
		updatedAt: { name: "Updated At", type: "date" },
		userProfileSurveyPassed: {
			name: "User Profile Survey Passed",
			type: "select",
			options: [
				{ label: "true", value: true },
				{ label: "false", value: false },
			],
		},
		welcomePopupShown: {
			name: "Welcome Popup Shown",
			type: "select",
			options: [
				{ label: "true", value: true },
				{ label: "false", value: false },
			],
		},
		wizardSurveyPassed: {
			name: "Wizard Survey Passed",
			type: "select",
			options: [
				{ label: "true", value: true },
				{ label: "false", value: false },
			],
		},
	};

	let isDisabled = false;

	const EditUserModalInputs = Object.keys(userData).map((key) => {
		if (inputConfig[key]) {
			if (inputConfig[key].doAdmin && !isAdmin) {
				console.log(key, "should be disabled");
				isDisabled = true;
			} else {
				isDisabled = false;
			}
			if (inputConfig[key].isForbidden && !inputConfig[key].doAdmin) {
				return null;
			} else {
				if (inputConfig[key].type == "select") {
					return (
						<React.Fragment key={key}>
							<FormLabel>{inputConfig[key].name}</FormLabel>
							<Select
								{...register(key, {
									required: `${key} is required.`,
								})}
								placeholder={userData.key}
								isDisabled={isDisabled}
							>
								{inputConfig[key].options.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</Select>
						</React.Fragment>
					);
				} else {
					return (
						<React.Fragment key={key}>
							<FormLabel>{inputConfig[key].name}</FormLabel>
							<Input
								{...register(key)}
								type={inputConfig[key].type}
								placeholder={userData[key]}
								isDisabled={isDisabled}
							/>
						</React.Fragment>
					);
				}
			}
		}
		return null;
	});

	//console.log("Errors", errors)

	return (
		<Modal isOpen={isOpen} onClose={() => doOpen(false)}>
			<ModalOverlay />
			<ModalContent maxH={"100vh"}>
				<ModalHeader>
					{"Edit: " + userData.firstName + " " + userData.lastName}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody maxH='80%' overflowY='auto'>
					<form
						onSubmit={handleSubmit((data) => {
							doOpen(false);
							editUser(data);
						})}
					>
						{EditUserModalInputs}
						<Input
							colorScheme={colors.mainColor}
							mt='5'
							//bgColor={colors.mainColor}
							fontWeight={"bold"}
							type='submit'
							value='Edit User'
						/>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
