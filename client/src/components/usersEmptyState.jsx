import { Box, Center, Text } from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";

export default function UsersEmptyState() {
	return (
		<Box w='100%' h='50vh' bgColor={colors.ligrey}>
			<Center h='100%'>
				<Text color={colors.dagrey} fontWeight={"bold"} fontSize={"20"}>
					Oops... There are no users. Please add some.
				</Text>
			</Center>
		</Box>
	);
}
