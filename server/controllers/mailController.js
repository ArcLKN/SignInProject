const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const nodemailer = require("nodemailer");

async function getConfirmation(req, res) {
	try {
		const token = req.params.token;
		const decoded = jwt.verify(token, process.env.SECRET_MAIL_TOKEN);
		const user = await UserModel.findOne({ _id: decoded.id });
		if (!user) {
			return res.status(400).send("Invalid token.");
		}

		user.verifiedUser = true;
		await user.save();
		res.send("Account confirmed successfully.");
		return true;
	} catch (error) {
		console.log(error);
		return res.status(400).send("Error confirming account.");
	}
}

async function sendDataTo(req, res) {
	console.log(req.body);
	const receiver = req.body.receiver;
	const data = req.body.data;

	if (!receiver) {
		return res
			.status(400)
			.json({ success: false, error: "No recipient defined" });
	}

	const fileName = "users.json";
	const filePath = path.join(__dirname, fileName);

	fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
		if (err) {
			console.error("Error writing file", err);
			return res
				.status(500)
				.json({ success: false, error: "Error writing file" });
		}
	});
	/*
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
		to: receiver,
		subject: "Welcome to Prelaunch Backoffice!",
		html: `Here is a file for you.`,
		attachments: [
			{
				filename: "users.json",
				path: filePath,
				contentType: "application/json",
			},
		],
	};

	try {
		let info = await transporter.sendMail(mailData);
		console.log("Success sending email");

		res.status(200).json({
			success: true,
			messageId: info.messageId,
			previewUrl: nodemailer.getTestMessageUrl(info),
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
		*/
}

module.exports = {
	getConfirmation,
	sendDataTo,
};
