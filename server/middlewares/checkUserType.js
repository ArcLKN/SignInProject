// server/middlewares/checkUserType.js

const UserModel = require("../models/User");

function checkUserType(requiredUserTypes) {
	return (req, res, next) => {
		const id = req.params.id || req.user.id;
		const userType = UserModel.findOne({ _id: id }).select("userType"); // Assurez-vous que `req.user` contient l'utilisateur authentifié avec le type d'utilisateur
		if (!requiredUserTypes.includes(userType)) {
			return res.status(403).json({ error: "Not enough permissions" });
		}
		next();
	};
}

module.exports = checkUserType;
