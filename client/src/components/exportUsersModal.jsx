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
	Button,
	HStack,
} from "@chakra-ui/react";
import { colors } from "../styleVariables";

export default function ExportUsersModal({
	isOpen,
	doOpen,
	setDoShowExportMail,
}) {
	const exportsType = [
		{ type: "json", label: "JSON" },
		//{ type: "csv", label: "CSV" },
		{ type: "pdf", label: "PDF" },
		//{ type: "xls", label: "XLS" },
	];

	return (
		<Modal isOpen={isOpen} onClose={() => doOpen(false)}>
			<ModalOverlay />
			<ModalContent maxH={"100vh"}>
				<Center>
					<ModalHeader>{"Export"}</ModalHeader>
				</Center>

				<ModalCloseButton />
				<ModalBody maxH='80%' overflowY='auto'>
					<Center>
						<HStack>
							{exportsType.map((exportType) => (
								<Button
									key={"exportsType" + exportType.type}
									onClick={() => {
										doOpen(false);
										setDoShowExportMail({
											isOpen: true,
											type: exportType.type,
										});
									}}
								>
									{exportType.type}
								</Button>
							))}
						</HStack>
					</Center>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
