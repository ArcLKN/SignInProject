import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Button } from "@chakra-ui/react";
import { colors } from "../styleVariables";

const AddUserButton = ({ showAddUserModal }) => {
	return (
		<Box>
			<Flex direction='row'>
				<HStack spacing='3'>
					<Button
						colorScheme={colors.mainColor}
						onClick={showAddUserModal}
					>
						Add new user
					</Button>
				</HStack>
			</Flex>
		</Box>
	);
};

export default AddUserButton;
