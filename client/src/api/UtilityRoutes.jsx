export async function sendMailTo(fileType, receiver, data) {
	console.log(data);
	const token = localStorage.getItem("token");
	if (!token) return;
	if (!receiver) return { error: "There must be an email" };
	if (!data) return { error: "No valid data" };
	try {
		const response = await window.fetch(`http://localhost:3001/api/email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				data: data,
				fileType: fileType,
				receiver: receiver,
			}),
		});
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
