import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Button } from "@chakra-ui/react";
import { colors } from "../styleVariables";

const AddUserButton = ({ showAddUserModal }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	const token = localStorage.getItem("token");
	if (!token) {
		return <></>;
	}

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/isAdmin/${token}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const json = await response.json();
				if (json.msg) {
					setIsAdmin(true);
				}
			} catch (error) {
				console.error("There was an error!", error);
			} finally {
				setLoading(false);
			}
		};
		checkAdmin();
	}, [token]);

	if (loading) {
		return <></>;
	}

	if (!isAdmin) {
		return <></>;
	}

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
