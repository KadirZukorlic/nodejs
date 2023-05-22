const express = require('express')

const router = express.Router()

const users = []

router.get('/users', (req, res, next) => {
	res.render('assignments/users-assignment', {
		users: users
	})
})

router.post('/', (req, res, next) => {
	users.push({ name: req.body.name })
	res.redirect('/')
})

exports.routes = router
exports.users = users
