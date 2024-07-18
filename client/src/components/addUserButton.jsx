import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Button } from "@chakra-ui/react";
import { colors } from "../styleVariables";

const AddUserButton = ({ showAddUserModal }) => {
	return (
		<Button colorScheme={colors.mainColor} onClick={showAddUserModal}>
			Add new user
		</Button>
	);
};

export default AddUserButton;
