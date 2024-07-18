import { Box, Flex, HStack, Button } from "@chakra-ui/react";
import { colors } from "../styleVariables";

export default function BulkDeleteUsers({ bulkDeleteUsers, selectedRows }) {
	return (
		<Box>
			<Flex direction='row'>
				<HStack spacing='3'>
					<Button
						colorScheme={"red"}
						onClick={() => bulkDeleteUsers(selectedRows)}
					>
						Delete Users
					</Button>
				</HStack>
			</Flex>
		</Box>
	);
}
