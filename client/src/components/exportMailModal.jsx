import {
	Text,
	Input,
	Center,
	Flex,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	HStack,
	FormLabel,
} from "@chakra-ui/react";
import { colors } from "../styleVariables";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ExportMailModal({
	isOpen,
	doOpen,
	intermediaryExportUsers,
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({});

	const [errorMessage, setErrorMessage] = useState("");

	async function handleSend(data) {
		const result = await intermediaryExportUsers(isOpen.type, data.email);
		if (result.error) {
			setErrorMessage(result.error);
		} else {
			doOpen(false);
		}
	}

	function handleClose() {
		doOpen(false);
		setErrorMessage("");
	}

	return (
		<Modal isOpen={isOpen.isOpen} onClose={() => handleClose()}>
			<ModalOverlay />
			<ModalContent maxH={"100vh"}>
				<ModalHeader>{"Export: " + isOpen.type}</ModalHeader>
				<ModalCloseButton />
				<ModalBody maxH='80%' overflowY='auto'>
					<form
						onSubmit={handleSubmit((data) => {
							handleSend(data);
						})}
					>
						<FormLabel>Email</FormLabel>
						<Input
							{...register("email", {
								required: "Email is required.",
							})}
						/>
						<Text color={colors.redError}>
							{errors.email?.message}
						</Text>
						<Input
							colorScheme={colors.mainColor}
							mt='5'
							fontWeight={"bold"}
							type='submit'
							value='Send'
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
