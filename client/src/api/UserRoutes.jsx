// /client/src/api/UserRoutes.jsx

async function checkAuth() {
	const token = localStorage.getItem("token");
	if (!token) {
		return;
	} else return token;
}

export async function getUsers() {
	const token = await checkAuth();
	if (!token) return;
	try {
		const response = await window.fetch("http://localhost:3001/api/users", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const json = await response.json();
		console.log(json);
		return json["msg"];
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

export async function databaseDeleteUser(event) {
	const token = localStorage.getItem("token");
	if (!token) return;
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/users/${event.id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(event),
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return data; // Process the response data if needed
	} catch (error) {
		console.error("There was an error!", error);
		// Handle the error appropriately
	}
}

export async function checkUser(event) {
	console.log("Trying to check user");
	try {
		const response = await window.fetch(
			"http://localhost:3001/api/check-login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(event),
			}
		);
		const json = await response.json();
		if (json.msg && json.token) {
			localStorage.setItem("token", json.token);
			window.location.href = "/users";

			return [true, json.msg];
		} else if (json.error) {
			console.error("Server response error:", json.error);
			console.log(json.error);
			return [false, json.error];
		}
	} catch (error) {
		console.error("Fetch error:", error);
		return [false, "Fetch error"];
	}
}

export async function editUser(user) {}

export async function getUser(userId) {
	const token = await checkAuth();
	if (!token) return;
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/user/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const json = await response.json();
		console.log(json);
		return json["msg"];
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

export async function databaseUpdateUser(newUserData) {
	console.log(newUserData);
	const token = localStorage.getItem("token");
	if (!token) return;
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/users/${newUserData._id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(newUserData),
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return data; // Process the response data if needed
	} catch (error) {
		console.error("There was an error!", error);
		// Handle the error appropriately
	}
}
