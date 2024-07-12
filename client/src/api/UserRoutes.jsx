// /client/src/api/UserRoutes.jsx

async function checkAuth() {
	const token = localStorage.getItem("token");
	if (!token) {
		return;
	} else return token;
}

export async function getUsers() {
	const token = checkAuth();
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
		return json["msg"];
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}
