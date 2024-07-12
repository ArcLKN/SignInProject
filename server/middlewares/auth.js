// /server/middlewares/auth.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		console.log("Token absent, envoi du statut 401 Unauthorized");
		return res.sendStatus(401);
	}
	jwt.verify(token, process.env.SECRET_AUTH_TOKEN, (err, user) => {
		if (err) {
			console.error("Erreur de vérification du jeton:", err);
			return res.sendStatus(403);
		}
		console.log("Utilisateur authentifié avec succès");
		req.user = user;
		next();
	});
}

module.exports = authenticateToken;
