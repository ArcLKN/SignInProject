const config = {
	local: {
		mode: "local",
		port: 3001,
	},
	staging: {
		mode: "staging",
		port: 4000,
	},
	production: {
		mode: "production",
		port: 5000,
	},
};

const emailConfig = {
	emailService: "gmail", // your email domain
	emailAuth: {
		user: process.env.NODEJS_GMAIL_APP_USER, // your email address
		pass: process.env.NODEJS_GMAIL_APP_PASSWORD, // your password
	},
};

module.exports = function (mode) {
	return config[mode || process.argv[2] || "local"] || config.local;
};
