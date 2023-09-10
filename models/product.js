const { getDb } = require('../util/database')
const { ObjectId } = require('mongodb')

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title
		this.price = price
		this.description = description
		this.imageUrl = imageUrl
		this._id = new ObjectId(id)
	}

	save() {
		const db = getDb()
		let dbOp // db operation
		if (this._id) {
			// update the product
			dbOp = db
				.collection('products')
				.updateOne({ _id: this._id }, { $set: this }) // this refers (call-site) to constructor properties; for example: we could say { $set: { title: this.title, description: this.description } } ... but as we want to pass all the arguments we set it to `this`
		} else {
			dbOp = db.collection('products').insertOne(this)
		}
		return dbOp
			.then((result) => {
				console.log(result)
			})
			.catch((err) => console.log(err))
	}

	static fetchAll() {
		const db = getDb()
		return db
			.collection('products')
			.find()
			.toArray()
			.then((products) => {
				console.log(products)
				return products
			})
			.catch((err) => console.log(err))
	}
	static findById(prodId) {
		const id = new ObjectId(prodId)
		const db = getDb()
		return db
			.collection('products')
			.find({ _id: id })
			.next()
			.then((product) => {
				console.log(product)
				return product
			})
			.catch((err) => console.log(err))
	}
	static deleteById(prodId) {
		const db = getDb()
		return db
			.collection('products')
			.deleteOne({ _id: new ObjectId(prodId) })
			.then((result) => {
				console.log('Deleted')
			})
			.catch((err) => console.log(err))
	}
}

module.exports = Product
