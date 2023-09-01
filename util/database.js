const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
	MongoClient.connect(
		'mongodb+srv://Kadir:starfallkacobre1@cluster0.h22nx.mongodb.net/?retryWrites=true&w=majority'
	)
		.then((client) => {
			console.log('Connected!')
			callback(client)
		})
		.catch((error) => console.log(error))
}

module.exports = mongoConnect
