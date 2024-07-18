import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Button } from "@chakra-ui/react";
import { colors } from "../styleVariables";

const ExportUsersButton = () => {
	return (
		<Button
			colorScheme={colors.gray}
			//onClick={}
		>
			Export
		</Button>
	);
};

export default ExportUsersButton;
