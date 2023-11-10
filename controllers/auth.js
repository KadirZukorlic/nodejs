const User = require('../models/user')

const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

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
		errorMessage: req.flash('error'),
		oldInput: {
			email: '',
			password: '',
			confirmPassword: ''
		},
		validationErrors: []
	})
}

exports.postLogin = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password

	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg
		})
	}

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
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		console.log('errorsssss: ', errors.array())
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
				confirmPassword: req.body.confirmPassword
			},
			validationErrors: errors.array()
		})
	}

	bcrypt
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

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then((user) => {
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New Password',
				errorMessage: req.flash('error'),
				userId: user._id.toString(),
				passwordToken: token
			})
		})
		.catch((err) => {
			console.log(err)
		})
}

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password
	const userId = req.body.userId
	const passwordToken = req.body.passwordToken

	let resetUser

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId
	})
		.then((user) => {
			resetUser = user
			return bcrypt.hash(newPassword, 12)
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword
			resetUser.resetToken = undefined
			resetUser.resetTokenExpiration = undefined
			return resetUser.save()
		})
		.then((result) => {
			res.redirect('/login')
		})
		.catch((err) => console.log(err))
}
