const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const errorController = require('./controllers/error')
const shopRoutes = require('./routes/shop')
const CartItem = require('./models/cart-item')

// parses incoming requests available in req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
	User.findByPk(1)
		.then((user) => {
			req.user = user
			next()
		})
		.catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

// Sequalize create relations of `Product` and `User`. check => https://sequelize.org/docs/v6/core-concepts/assocs/ for more info
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// Sequalize create tables
sequelize
	// .sync({ force: true })
	.sync()
	.then((result) => {
		return User.findByPk(1)
		// console.log(result)
	})
	.then((user) => {
		if (!user) {
			return User.create({
				name: 'Kadir',
				email: 'test@test.com'
			})
		}
		return user
	})
	.then((user) => {
		// console.log(user)
		user.createCart()
		app.listen(3000)
	})
	.catch((err) => console.log(err))

// This is what is under the hood in express
// app.listen = function listen() {
//     var server = http.createServer(this);
//     return server.listen.apply(server, arguments);
//   };
