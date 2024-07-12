const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.signUp = async (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.send({ errors: result.array() });
	}
	try {
		const eventData = req.body;
		// Vérifier si l'utilisateur existe déjà
		const existingUser = await UserModel.findOne({
			email: eventData.email,
		});
		if (existingUser) {
			return res.status(400).json({ error: "Email already exists" });
		}
		const hashedPassword = await bcrypt.hash(eventData.password, 10);
		const creationDate = new Date();
		const newUser = await UserModel.create({
			firstName: eventData.firstName,
			lastName: eventData.lastName,
			email: eventData.email,
			password: hashedPassword,
			createdAt: creationDate.toLocaleString(),
			userType: "User",
			projectsCollaboratorsCount: 0,
			projectsCount: 0,
			ideaProjectsCount: 0,
			reservationsCount: 0,
			socialPicture: "",
			subscriptionsCount: 0,
			signUpMethod: "Sign-Up",
			stripeCustomedId: "",
			unseenSystemNotificationsCount: 0,
			updatedAt: creationDate.toLocaleString(),
			userProfileSurveyPassed: false,
			welcomePopupShown: false,
			wizardSurveyPassed: false,
			validatedUser: false,
		});
		const accessToken = jwt.sign(
			{ id: newUser._id, email: newUser.email },
			process.env.SECRET_AUTH_TOKEN,
			{
				expiresIn: "1h",
			}
		);
		res.status(201).json({
			msg: {
				user: {
					firstName: newUser.firstName,
					lastName: newUser.lastName,
					email: newUser.email,
					// Ajouter d'autres champs si nécessaire
				},
				token: accessToken,
			},
		});
		return;
	} catch (error) {}
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
			.json({ msg: "Sign-in successful", token: accessToken });
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
	res.json({ msg: crypto.randomBytes(24 / 2).toString("hex") });
};
