const UserModel = require("../models/User");

function checkUserType(requiredUserTypes) {
	return function (req, res, next) {
		const id = req.user._id;

		UserModel.findOne({ _id: id })
			.select("userType")
			.then((user) => {
				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}

				const userType = user.userType;

				if (!requiredUserTypes.includes(userType)) {
					console.log("No permissions");
					return res
						.status(403)
						.json({ error: "Not enough permissions" });
				}

				console.log("Admin");
				next();
			})
			.catch((error) => {
				console.error("Error checking user type:", error);
				res.status(500).json({ error: "Server error" });
			});
	};
}

module.exports = checkUserType;
