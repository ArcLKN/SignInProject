// /server/controllers/userController.js
const UserModel = require("../models/User");
const { validationResult } = require("express-validator");

async function getUsers(req, res) {
	try {
		const userData = await UserModel.find();
		res.status(200).json({ msg: userData, error: "Opération réussie" });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Server error" });
	}
}

async function addUser(req, res) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		try {
			const eventData = req.body;
			console.log("Got a new user:", eventData);
			await UserModel.create(eventData);
			res.status(200).json({
				msg: "Opération réussie",
			});
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(400).json({ error: "Error fetching users" });
		}
		return;
	}
	res.status(500).send({ errors: result.array() });
}

async function deleteOneUser(req, res) {
	const result = validationResult(req.params.id);
	if (result.isEmpty()) {
		try {
			const eventData = req.params.id;
			await UserModel.deleteOne({ _id: req.params.id });
			console.log("Sucessufully deleted user:", req.params.id);
			res.status(200).json({
				msg: eventData,
				error: "Opération réussie",
			});
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(400).json({ error: "Error fetching users" });
		}
		return;
	}
	res.status(500).send({ errors: result.array() });
}

module.exports = {
	getUsers,
	addUser,
	deleteOneUser,
};
