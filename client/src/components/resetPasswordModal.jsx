import {
	Text,
	Input,
	Center,
	FormLabel,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { colors } from "../styleVariables";
import { useState } from "react";

export default function ResetPasswordModal({
	isOpen,
	doOpen,
	resetUserPassword,
	resetUserPasswordId,
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({});

	// prettier-ignore
	const PATTERN = {
		email: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g,
		name: /^[\w -]{4,100}$/i,
		password: /^[\w \-\!\.\?]{4,100}$/,
  	};

	const [errorMessage, setErrorMessage] = useState("");

	async function handleConfirm(data) {
		const result = await resetUserPassword(
			"password",
			resetUserPasswordId,
			data
		);
		if (result.error) {
			setErrorMessage(result.error);
		} else {
			doOpen(false);
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={() => doOpen(false)}>
			<ModalOverlay />
			<ModalContent maxH={"100vh"}>
				<ModalHeader>{"Reset Password"}</ModalHeader>
				<ModalCloseButton />
				<ModalBody maxH='80%' overflowY='auto'>
					<form
						onSubmit={handleSubmit((data) => {
							handleConfirm(data);
						})}
					>
						<FormLabel>Old password</FormLabel>
						<Input
							{...register("oldPassword", {
								required: "Old password is required.",
								minLength: {
									value: 4,
									message: "Min length is 4.",
								},
								maxLength: {
									value: 100,
									message: "Max length is 100.",
								},
								pattern: {
									value: PATTERN.password,
									message:
										"Password can contain a-zA-Z0-9 ?!.-_",
								},
							})}
							//type={inputConfig[key].type}
						/>
						<Text color={colors.redError}>
							{errors.oldPassword?.message}
						</Text>
						<FormLabel>New password</FormLabel>
						<Input
							{...register("newPassword", {
								required: "New password is required.",
								minLength: {
									value: 4,
									message: "Min length is 4.",
								},
								maxLength: {
									value: 100,
									message: "Max length is 100.",
								},
								pattern: {
									value: PATTERN.password,
									message:
										"Password can contain a-zA-Z0-9 ?!.-_",
								},
							})}
							//type={inputConfig[key].type}
						/>
						<Text color={colors.redError}>
							{errors.newPassword?.message}
						</Text>
						<FormLabel>Confirm new password</FormLabel>
						<Input
							{...register("confirmNewPassword", {
								required:
									"You need to confirm the new password.",
							})}
							//type={inputConfig[key].type}
						/>
						<Text color={colors.redError}>
							{errors.confirmNewPassword?.message}
						</Text>

						<Input
							colorScheme={colors.mainColor}
							mt='5'
							fontWeight={"bold"}
							type='submit'
							value='Confirm'
						/>
						<Center>
							<Text color={colors.redError}>{errorMessage}</Text>
						</Center>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
