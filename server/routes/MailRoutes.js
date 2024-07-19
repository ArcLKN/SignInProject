// server/routes/MailRoutes.js
const express = require("express");
const { check } = require("express-validator");
const {
	getConfirmation,
	sendDataTo,
} = require("../controllers/mailController");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.get("/email/:token", getConfirmation);
router.post("/email", authenticateToken, sendDataTo);

module.exports = router;
