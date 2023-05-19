const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
	res.send('<h1>radi li server uopste</h1>')
})

app.listen(3000)
