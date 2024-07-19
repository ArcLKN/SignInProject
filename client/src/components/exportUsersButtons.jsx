import React from "react";
import { Button } from "@chakra-ui/react";
import { colors } from "../styleVariables";

const ExportUsersButton = ({ setDoShowExportModal }) => {
	return (
		<Button
			colorScheme={colors.gray}
			onClick={() => setDoShowExportModal(true)}
		>
			Export
		</Button>
	);
};

export default ExportUsersButton;
