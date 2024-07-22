const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");

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
	const validExtensions = ["json", "xls", "pdf"];

	const { fileType, receiver, data } = req.body;

	if (!receiver) {
		return res
			.status(400)
			.json({ success: false, error: "No recipient defined" });
	}
	if (!fileType) {
		return res
			.status(400)
			.json({ success: false, error: "No valid file type defined" });
	}
	if (!validExtensions.includes(fileType)) {
		return res
			.status(400)
			.json({ success: false, error: "No valid file type defined" });
	}
	const fileName = `users.${fileType}`;
	const filePath = path.join(__dirname + "\\..\\..\\temp", fileName);
	console.log(filePath, __dirname + "\\..\\..\\temp");
	// Write data to file

	console.log(fileType, filePath);

	try {
		if (fileType == "json") {
			await fs.promises.writeFile(
				filePath,
				JSON.stringify(data, null, 2)
			);
		} else if (fileType == "pdf") {
			const doc = new jsPDF();
			let yPosition = 10; // Starting y position for text

			const userKeys = {
				_id: "ID",
				createdAt: "Created At",
				email: "Email",
				firstName: "First Name",
				lastName: "Last Name",
				userType: "User Type",
				projectsCollaboratorsCount: "Projects Collaborators Count",
				projectsCount: "Projects Count",
				ideaProjectsCount: "Idea Projects Count",
				reservationsCount: "Reservations Count",
				socialPicture: "Social Picture",
				subscriptionsCount: "Subscriptions Count",
				signUpMethod: "Sign Up Method",
				stripeCustomedId: "Stripe Customer ID",
				unseenSystemNotificationsCount:
					"Unseen System Notifications Count",
				updatedAt: "Updated At",
				userProfileSurveyPassed: "User Profile Survey Passed",
				welcomePopupShown: "Welcome Popup Shown",
				wizardSurveyPassed: "Wizard Survey Passed",
				verifiedUser: "Verified User",
			};

			data.forEach(function (user, i) {
				doc.text(20, yPosition, `User ${i + 1}:`);
				yPosition += 10;

				Object.keys(userKeys).forEach((key) => {
					doc.text(20, yPosition, `${userKeys[key]}: ${user[key]}`);
					yPosition += 10;

					// Check if the yPosition is near the bottom of the page, and if so, create a new page
					if (yPosition > 280) {
						// assuming A4 page height of 297mm
						doc.addPage();
						yPosition = 10; // reset y position for new page
					}
				});

				yPosition += 10; // Add extra space between users
			});

			// Save the PDF
			doc.save(filePath);
		} else if (fileType == "xls") {
		} else {
		}
	} catch (err) {
		console.error("Error writing file", err);
		return res
			.status(500)
			.json({ success: false, error: "Error writing file" });
	}
	// Configure email
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
				filename: fileName,
				path: filePath,
				contentType: "application/json",
			},
		],
	};
	// Send email
	try {
		let info = await transporter.sendMail(mailData);
		console.log("Success sending email");

		// Clean up file after sending email
		fs.promises
			.unlink(filePath)
			.catch((err) => console.error("Error deleting file", err));

		res.status(200).json({
			success: true,
			messageId: info.messageId,
			previewUrl: nodemailer.getTestMessageUrl(info),
		});
	} catch (err) {
		console.error("Error sending email", err);

		// Attempt to clean up file even if sending email failed
		fs.promises
			.unlink(filePath)
			.catch((err) => console.error("Error deleting file", err));

		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
}

module.exports = {
	getConfirmation,
	sendDataTo,
};
