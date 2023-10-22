const User = require('../models/user')

const crypto = require('crypto')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: req.flash('error')
	})
}

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: req.flash('error')
	})
}

exports.postLogin = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid email or password.')
				return res.redirect('/login')
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true
						req.session.user = user
						return req.session.save((err) => {
							console.log(err)
							res.redirect('/')
						})
					}
					req.flash('error', 'Invalid email or password.')
					res.redirect('/login')
				})
				.catch((err) => {
					console.log(err)
					res.redirect('/login')
				})
		})
		.catch((err) => console.log(err))
}

exports.postSignup = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password
	const confirmPassword = req.body.confirmPassword

	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash('error', 'Email exists already, please pick a different one.')
				return res.redirect('/signup')
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] }
					})
					return user.save()
				})
				.then(() => {
					res.redirect('/login')
				})
		})
		.catch((err) => console.log(err))
}

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err)
		res.redirect('/')
	})
}

// TODO: Create reset password logic
exports.getReset = (req, res, next) => {
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: req.flash('error')
	})
}

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err)
			return res.redirect('/reset')
		}
		const token = buffer.toString('hex')
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'No account with that email found.')
					return res.redirect('/reset')
				}
				user.resetToken = token
				user.resetTokenExpiration = Date.now() + 3600000
				return user.save()
			})
			.then((result) => {
				// Use some external resource to send a email like: SendGrid (which doesn't work for my account atm)
			})
			.catch((err) => {
				console.log(err)
			})
	})
}
