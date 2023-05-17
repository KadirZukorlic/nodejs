const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const expressHbs = require('express-handlebars')

const app = express()

app.engine(
	'hbs',
	expressHbs({
		layoutsDir: 'views/layouts',
		defaultLayout: 'main',
		extname: 'hbs'
	})
)
app.set('view engine', 'hbs')
app.set('views', 'views')

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRoutes)

app.use((req, res, next) => {
	res.status(404).render('404', { pageTitle: 'Error 404' })
})

app.listen(3000)

// This is what is under the hood in express
// app.listen = function listen() {
//     var server = http.createServer(this);
//     return server.listen.apply(server, arguments);
//   };
