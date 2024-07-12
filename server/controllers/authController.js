const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.signUp = async (req, res) => {
	const result = validationResult(req);
	if (result.isEmpty()) {
		console.log(req.body);
		const eventData = req.body;
		const userData = await UserModel.exists({ email: eventData.email });
		if (userData) {
			return res.send({ msg: null });
		}
		eventData.password = await bcrypt.hash(eventData.password, 10);
		await UserModel.create(eventData);
		const accessToken = jwt.sign(eventData, process.env.SECRET_AUTH_TOKEN, {
			expiresIn: "1h",
		});
		res.send({ msg: { eventData, token: accessToken } });
		return;
	}
	res.send({ errors: result.array() });
};

exports.checkLogin = async (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	const loginEmail = req.body.email;
	const loginPassword = req.body.password;
	try {
		const user = await UserModel.findOne({ email: loginEmail }).lean();
		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}
		const isMatch = await bcrypt.compare(loginPassword, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" });
		}
		const accessToken = jwt.sign(user, process.env.SECRET_AUTH_TOKEN);
		return res
			.status(200)
			.send({ msg: "Sign-in successful", token: accessToken });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

exports.helloWorld = (req, res) => {
	console.log("Hello World");
	res.json({ message: "Hello World!" });
};

exports.generateRandomId = (req, res) => {
	res.send({ msg: crypto.randomBytes(24 / 2).toString("hex") });
};
