const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')

const app = express()

// app.engine(
// 	'hbs',
// 	expressHbs({
// 		layoutsDir: 'views/layouts',
// 		defaultLayout: 'main',
// 		extname: 'hbs'
// 	})
// )

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const errorController = require('./controllers/error')
const shopRoutes = require('./routes/shop')

// parses incoming requests available in req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

app.listen(3000)

// This is what is under the hood in express
// app.listen = function listen() {
//     var server = http.createServer(this);
//     return server.listen.apply(server, arguments);
//   };
