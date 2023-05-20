const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const usersData = require('./routes/user')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(usersData.routes)

app.use((req, res, next) => {
	console.log(usersData.users)
	res.render('form-assignment', { pageTitle: 'Add User' })
})

app.listen(3000)
