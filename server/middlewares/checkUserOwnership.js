function checkUserOwnership(req, res, next) {
	const id = req.user.id;

	if (req.userId !== id) {
		return res.status(403).json({ error: "Access denied" });
	}

	next();
}

module.exports = checkUserOwnership;
