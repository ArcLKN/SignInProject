import React, { useState, useEffect } from "react";
import { MenuItem } from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx"; // Assurez-vous d'importer vos couleurs correctement

async function getUserManageOptions(userId) {
	const token = localStorage.getItem("token");
	if (!token) return null;
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/manage/users/${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.msg;
	} catch (error) {
		console.error("There was an error!", error);
		return null;
	}
}

const UserActionsMenu = ({
	userId,
	deleteUser,
	_id,
	showEditUserModal,
	showResetUserPasswordModal,
}) => {
	const [options, setOptions] = useState({});
	useEffect(() => {
		const fetchOptions = async () => {
			const data = await getUserManageOptions(_id);
			if (data) {
				setOptions(data);
			}
		};

		fetchOptions();
	}, [_id]);

	return (
		<div>
			{Object.keys(options).map((key) => (
				<MenuItem
					key={key}
					p='2'
					bgColor={
						key === "delete" ? colors.redError : colors.bgColor
					}
					onClick={() => {
						if (key === "delete") {
							deleteUser(userId, _id);
						} else if (key === "edit") {
							showEditUserModal(_id);
						} else if (key === "password") {
							showResetUserPasswordModal(_id);
						}
					}}
				>
					{options[key].name}
				</MenuItem>
			))}
		</div>
	);
};

export default UserActionsMenu;
