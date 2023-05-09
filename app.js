const http = require('http')

const server = http.createServer((req, res) => {
	console.log(req.url, req.method, req.headers)
	// process.exist() // triggers hard exit on event loop
	res.setHeader('Content-Type', 'text/html')
	res.write('<html>')
	res.write('<head><title>My first page</title></head>')
	res.write('<body><h1>Hellow from node.js server</h1></body>')
	res.write('</html>')
	res.end()
})

server.listen(3000)
