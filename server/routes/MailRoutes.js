// server/routes/MailRoutes.js
const express = require("express");
const { check } = require("express-validator");
const { sendConfirmationMail } = require("../controllers/mailController");
const { authenticateToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/email", authenticateToken, sendConfirmationMail);
