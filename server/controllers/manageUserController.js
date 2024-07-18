// /server/controllers/manageUserController.js
const UserModel = require("../models/User");

async function sendPossibleManageOptions(req, res) {
	try {
		let userType = await UserModel.findOne({ _id: req.user._id }).select(
			"userType"
		);
		let isOwner = req.user._id === req.params.id;
		let options = {};
		if (["Admin", "Super Admin"].includes(userType.userType)) {
			options.edit = {
				type: "PUT",
				url: "/api/users/:id",
				name: "Edit",
			};
			options.delete = {
				type: "DELETE",
				url: "/api/users/:id",
				name: "Delete",
			};
		}
		if (isOwner) {
			options.edit = {
				type: "PUT",
				url: "/api/users/:id",
				name: "Edit",
			};
			options.password = {
				type: "PUT",
				url: "/api/users/:id/password",
				name: "Reset Password",
			};
		}
		return res.status(200).json({ msg: options, error: "Success" });
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ error: "Server error" });
	}
}

module.exports = { sendPossibleManageOptions };
