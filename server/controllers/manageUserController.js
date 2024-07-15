// /server/controllers/manageUserController.js
const UserModel = require("../models/User");

async function sendPossibleManageOptions(req, res) {
	try {
		let options;
		let userType = await UserModel.findOne({ _id: req.user._id }).select(
			"userType"
		);
		if (["Admin", "Super Admin"].includes(userType.userType)) {
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
				};
			} else {
				options = {};
			}
		}
		console.log(options);
		return res.status(200).json({ msg: options, error: "Success" });
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ error: "Server error" });
	}
}

module.exports = { sendPossibleManageOptions };
