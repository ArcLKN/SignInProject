// /server/middlewares/auth.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	//console.log("Try authenticate Token");
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		console.log("Missing Token, Status 401 Unauthorized");
		return res.sendStatus(401);
	}
	jwt.verify(token, process.env.SECRET_AUTH_TOKEN, (err, user) => {
		if (err) {
			console.error("Could not verify token", err);
			return res.sendStatus(403);
		}
		req.user = user;
		next();
	});
}

module.exports = authenticateToken;
