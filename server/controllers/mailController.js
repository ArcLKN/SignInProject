async function getConfirmation(req, res) {
	try {
		const { token } = req.params;
		const decoded = jwt.verify(token, process.env.SECRET_MAIL_TOKEN); // Remplacez 'your_secret_key' par votre clé secrète

		const user = await User.findOne({ _id: decoded.userId });
		if (!user) {
			return res.status(400).send("Invalid token.");
		}

		user.isVerified = true;
		await user.save();

		res.send("Account confirmed successfully.");
	} catch (error) {
		res.status(400).send("Error confirming account.");
	}
}

module.exports = {
	getConfirmation,
};
