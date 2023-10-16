require('dotenv').config()

const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const errorController = require('./controllers/error')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const User = require('./models/user')

// parses incoming requests available in req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
	User.findById('651a002106390654b5397449')
		.then((user) => {
			req.user = user
			next()
		})
		.catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(authRoutes)

app.use(errorController.get404)
// use dotenv
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'Hamza',
					email: 'hamza@test.com',
					cart: {
						items: []
					}
				})
				user.save()
			}
		})
		app.listen(3000)
	})
	.catch((err) => console.log(err))
