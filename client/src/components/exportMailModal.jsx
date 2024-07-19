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

	function handleSend(data) {
		intermediaryExportUsers(isOpen.type, data.email);
	}

	return (
		<Modal isOpen={isOpen.isOpen} onClose={() => doOpen(false)}>
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
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
