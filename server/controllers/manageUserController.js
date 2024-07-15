// /server/controllers/manageUserController.js
const UserModel = require("../models/User");

async function sendPossibleManageOptions(req, res) {
	console.log(req.user);
	try {
		let userType = await UserModel.findOne({ _id: req.user._id }).select(
			"userType"
		);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Server error" });
	}

	if (userType in ["Admin", "Super Admin"]) {
		options = {
			edit: {
				type: "PUT",
				url: "/api/users/:id",
				name: "Edit",
			},
			delete: {
				type: "DELETE",
				url: "/api/users/:id",
				name: "Delete",
			},
		};
	} else {
		if (req.params.id == req.user._id) {
			options = {
				edit: {
					type: "PUT",
					url: "/api/users/:id",
					name: "Edit",
				},
				delete: {
					type: "DELETE",
					url: "/api/users/:id",
					name: "Delete",
				},
			};
		} else {
			options = {};
		}
	}
	res.status(200).json({ msg: option, error: "Success" });
}

module.exports = { sendPossibleManageOptions };
