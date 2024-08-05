export async function createNewProject(data) {
	console.log(data);
	const token = localStorage.getItem("token");
	if (!token) return { error: "No token found" };
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/projects`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: data,
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`${response.status} ${errorData.error || response.statusText}`
			);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("There was an error!", error);
		return { error: error.message };
	}
}

export async function getUserProjects() {
	const token = localStorage.getItem("token");
	if (!token) return { error: "No token found" };
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/projects`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`${response.status} ${errorData.error || response.statusText}`
			);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("There was an error!", error);
		return { error: error.message };
	}
}

export async function getProjectFromId(id) {
	const token = localStorage.getItem("token");
	if (!token) return { error: "No token found" };
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/projects/${id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`${response.status} ${errorData.error || response.statusText}`
			);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("There was an error!", error);
		return { error: error.message };
	}
}

export async function updateProjectFromId(id, newData) {
	const token = localStorage.getItem("token");
	if (!token) return { error: "No token found" };
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/projects/${id}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newData),
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`${response.status} ${errorData.error || response.statusText}`
			);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("There was an error!", error);
		return { error: error.message };
	}
}

export async function deleteProjectFromId(id, newData) {
	const token = localStorage.getItem("token");
	if (!token) return { error: "No token found" };
	try {
		const response = await window.fetch(
			`http://localhost:3001/api/projects/${id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`${response.status} ${errorData.error || response.statusText}`
			);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("There was an error!", error);
		return { error: error.message };
	}
}
