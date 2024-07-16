const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

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

module.exports = {
	getConfirmation,
};
