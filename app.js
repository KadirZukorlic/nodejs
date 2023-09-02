const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const errorController = require('./controllers/error')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const mongoConnect = require('./util/database').mongoConnect

// parses incoming requests available in req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
	// User.findByPk(1)
	// 	.then((user) => {
	// 		req.user = user
	// 		next()
	// 	})
	// 	.catch((err) => console.log(err))
	next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect(() => {
	app.listen(3000)
})
