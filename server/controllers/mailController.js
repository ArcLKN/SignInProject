exports.sendConfirmationMail = async (req, res) => {
	let config = {
		service: "gmail", // your email domain
		auth: {
			user: process.env.NODEJS_GMAIL_APP_USER, // your email address
			pass: process.env.NODEJS_GMAIL_APP_PASSWORD, // your password
		},
	};
	let transporter = nodemailer.createTransport(config);

	let mailData = {
		from: "kalidolkn@gmail.com", // sender address
		to: "raphaelgreiner0@gmail.com", // list of receivers
		subject: "Welcome to ABC Website!", // Subject line
		html: "<b>Hello world?</b>", // html body
	};

	transporter
		.sendMail(mailData)
		.then((info) => {
			return res.status(201).json({
				msg: "Email sent",
				info: info.messageId,
				preview: nodemailer.getTestMessageUrl(info),
			});
		})
		.catch((err) => {
			return res.status(500).json({ msg: err });
		});
};
