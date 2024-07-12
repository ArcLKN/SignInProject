// /server/controllers/userController.js
const UserModel = require("../models/User");
const { check, validationResult } = require("express-validator");

async function getUsers(req, res) {
	try {
		const userData = await UserModel.find();
		res.send({ msg: userData });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Server error" });
	}
}

async function addUser(req, res) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		const eventData = req.body;
		console.log("Got a new user:", eventData);
		await userModel.create(eventData);
		return;
	}
	res.send({ errors: result.array() });
}

async function deleteOneUser(req, res) {
	const result = validationResult(req.params.id);
	if (result.isEmpty()) {
		const eventData = req.params.id;
		await userModel.deleteOne({ _id: eventData.id });
		return;
	}
	res.send({ errors: result.array() });
}

module.exports = {
	getUsers,
	addUser,
	deleteOneUser,
};
