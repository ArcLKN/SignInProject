// server/middlewares/checkUserType.js

const UserModel = require("../models/User");

function checkUserType(requiredUserTypes) {
	return (req, res, next) => {
		const userType = UserModel.findOne({ _id: id }).select("userType"); // Assurez-vous que `req.user` contient l'utilisateur authentifié avec le type d'utilisateur
		if (!requiredUserTypes.includes(userType)) {
			return res.status(403).json({ error: "Access denied" });
		}
		next();
	};
}

module.exports = checkUserType;
