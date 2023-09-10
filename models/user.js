const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')

class User {
	constructor(username, email) {
		this.name = username
		this.email = email
	}

	save() {
		const db = getDb()
		return db
			.collection('users')
			.insertOne(this)
			.then(() => {
				console.log('user created')
			})
			.catch((err) => console.log(err))
	}

	static findById(userId) {
		const db = getDb()
		return db
			.collection('users')
			.findOne({ _id: new ObjectId(userId) })
			.then((user) => {
				console.log(user, 'user')
				return user
			})
			.catch((err) => console.log(err))
	}
}

module.exports = User
