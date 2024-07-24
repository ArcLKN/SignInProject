const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function sendConfirmationMail(userData, res) {
	const emailToken = jwt.sign(userData, process.env.SECRET_MAIL_TOKEN, {
		expiresIn: "1h",
	});
	let config = {
		service: "gmail",
		auth: {
			user: process.env.NODEJS_GMAIL_APP_USER,
			pass: process.env.NODEJS_GMAIL_APP_PASSWORD,
		},
	};
	let transporter = nodemailer.createTransport(config);
	let mailData = {
		from: "kalidolkn@gmail.com",
		to: userData.email,
		subject: "Welcome to Prelaunch Backoffice!",
		html: `Please validate your account by clicking on this link: <a href="http://localhost:3001/api/email/${emailToken}">Confirm Account</a>`,
	};

	try {
		let info = await transporter.sendMail(mailData);
		console.log("Success sending email");
		return {
			success: true,
			messageId: info.messageId,
			previewUrl: nodemailer.getTestMessageUrl(info),
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			error: err.message,
		};
	}
}

async function signUp(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.send({ errors: result.array() });
	}
	try {
		const eventData = req.body;
		const existingUser = await UserModel.findOne({
			email: eventData.email,
		});

		if (existingUser) {
			return res.status(400).json({ error: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(eventData.password, 10);
		const creationDate = new Date().toISOString();
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
			verifiedUser: false,
		});
		const emailResult = await sendConfirmationMail({
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
			id: newUser._id,
			isVerificationEmail: true,
		});

		if (!emailResult.success) {
			await UserModel.findByIdAndDelete(newUser._id);
			return res.status(500).json({
				error: "Error when sending confirmation mail",
				details: emailResult.error,
			});
		}
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
				},
				token: accessToken,
			},
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
}

async function checkLogin(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	const loginEmail = req.body.email;
	const loginPassword = req.body.password;
	try {
		const user = await UserModel.findOne({ email: loginEmail })
			.select("-socialPicture")
			.lean();
		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}
		if (!user.verifiedUser) {
			return res
				.status(400)
				.json({ error: "Please verify your account before sign-in." });
		}

		const isMatch = await bcrypt.compare(loginPassword, user.password);

		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" });
		}
		delete user.password;
		const accessToken = jwt.sign(user, process.env.SECRET_AUTH_TOKEN);
		return res
			.status(200)
			.json({ msg: "Sign-in successful", token: accessToken });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
}

function helloWorld(req, res) {
	console.log("Hello World");
	res.json({ message: "Hello World!" });
}

function generateRandomId(req, res) {
	res.json({ msg: crypto.randomBytes(24 / 2).toString("hex") });
}

async function isUserAdmin(req, res) {
	const result = validationResult(req.params.token);
	if (!result.isEmpty()) {
		return res.status(400).json({ msg: false });
	}
	try {
		const token = req.params.token;
		const decoded = jwt.verify(token, process.env.SECRET_AUTH_TOKEN);

		const user = await UserModel.findOne({ _id: decoded._id }).select(
			"userType"
		);

		if (!user) {
			return res.status(404).json({ msg: false });
		}

		if (["Admin", "Super Admin"].includes(user.userType)) {
			return res.status(200).json({ msg: true });
		}
		return res.status(403).json({ msg: false });
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ msg: false });
	}
}

async function getUserName(req, res) {
	const result = validationResult(req.params.token);
	if (!result.isEmpty()) {
		return res.status(400).json({ msg: false });
	}
	try {
		const token = req.params.token;
		const decoded = jwt.verify(token, process.env.SECRET_AUTH_TOKEN);

		const user = await UserModel.findOne({ _id: decoded._id }).select([
			"firstName",
			"lastName",
		]);

		if (!user) {
			return res.status(404).json({ msg: false });
		}
		return res.status(200).json({
			msg: { firstName: user.firstName, lastName: user.lastName },
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ msg: false });
	}
}

module.exports = {
	isUserAdmin,
	generateRandomId,
	helloWorld,
	signUp,
	checkLogin,
	getUserName,
};
