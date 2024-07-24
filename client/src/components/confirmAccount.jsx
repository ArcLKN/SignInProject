import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ConfirmAccount = ({ match }) => {
	const navigate = useNavigate();
	const { token } = useParams();
	console.log("TOKEN", token);

	useEffect(() => {
		const confirmAccount = async () => {
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/email/${token}`
				);
				if (!response.ok) {
					const data = await response.json();
					// Save the auth token to localStorage or context
					localStorage.setItem("token", data.authToken);

					// Redirect to /users
					navigate("/users");
					throw new Error(
						`${response.status} ${
							data.error || response.statusText
						}`
					);
				}
				const result = await response.json();
				return result;
			} catch (error) {
				console.error("There was an error!", error);
				return { error: error.message };
			}
		};

		confirmAccount();
	}, [token, navigate]);

	return (
		<div>
			<h1>Confirming your account...</h1>
		</div>
	);
};

export default ConfirmAccount;
