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

export default function EditUserModal({ isOpen, doOpen, editUser }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			userType: "User",
			email: "qwertzu@gmail.com",
		},
	});

	//console.log("Errors", errors)

	return (
		<Modal isOpen={isOpen} onClose={() => doOpen(false)}>
			<ModalOverlay />
			<ModalContent maxH={"100vh"}>
				<ModalHeader>Edit: User</ModalHeader>
				<ModalCloseButton />
				<ModalBody maxH='80%' overflowY='auto'>
					<form
						onSubmit={handleSubmit((data) => {
							doOpen(false);
							createNewUser(data);
						})}
					></form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
