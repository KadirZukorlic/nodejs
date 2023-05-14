const fs = require('fs')

const requestHandler = (req, res) => {
	const url = req.url
	const method = req.method

	if (url === '/') {
		res.setHeader('Content-Type', 'text/html')
		res.write('<html>')
		res.write('<head><title>Hello world!</title></head>')
		res.write('<h1>hello world</h1>')
		res.write(
			'<body><form action="/create-user" method="POST"><input type="text" name="user" /><button type="submit">Submit user</button></form></body>'
		)
		res.write('</html>')
		return res.end()
	}

	if (url === '/create-user' && method === 'POST') {
		const body = []

		req.on('data', (chunk) => {
			body.push(chunk)
		})

		req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString()
			const user = parsedBody.split('=')[1].replaceAll('+', ' ') // splits message=hamza and taking second item in array which is hamza
			console.log(user)
		})

		res.statusCode = 302
		res.setHeader('Location', '/')
		res.end()
	}
	if (url === '/users') {
		res.setHeader('Content-Type', 'text/html')
		res.write('<html>')
		res.write('<head><title>Hello world!</title></head>')
		res.write(`<ul><li>Kadir</li><li>Hamza</li><li>Amina</li></ul>`)
		res.write('</html>')
		return res.end()
	}
}

module.exports = requestHandler
