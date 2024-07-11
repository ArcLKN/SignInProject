const UserModel = require("../models/User");
const { check, validationResult } = require("express-validator");

exports.getUsers = async (req, res) => {
	const userData = await UserModel.find();
	console.log(userData);
	res.send({ msg: userData });
};

exports.addUser = async (req, res) => {
	const result = validationResult(req);
	if (result.isEmpty()) {
		const eventData = req.body;
		console.log("Got a new user:", eventData);
		await userModel.create(eventData);
		return;
	}
	res.send({ errors: result.array() });
};

exports.deleteOneUser = async (req, res) => {
	const result = validationResult(req);
	if (result.isEmpty()) {
		const eventData = req.body;
		await userModel.deleteOne({ _id: eventData.id });
		return;
	}
	res.send({ errors: result.array() });
};
