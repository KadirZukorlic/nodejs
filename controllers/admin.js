const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	})
}

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title
	const imageUrl = req.body.imageUrl
	const description = req.body.description
	const price = req.body.price

	const product = new Product(null, title, imageUrl, description, price)
	product
		.save()
		.then(() => {
			res.redirect('/')
		})
		.catch((err) => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit // => returns "true" or undefined based on if it finds edit in query param
	if (!editMode) {
		return res.redirect('/')
	}

	const prodId = req.params.productId
	Product.findById(prodId, (product) => {
		if (!product) {
			return res.redirect('/')
		}
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product
		})
	})
}

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId // if (editing) in edit-product.ejs we rendered hidden input with name productId, and value="<%= product.id %>" thats why req.body.productId gives us an actual id
	const updatedTitle = req.body.title
	const updatedImageUrl = req.body.imageUrl
	const updatedDescription = req.body.description
	const updatedPrice = req.body.price
	const updatedProduct = new Product(
		prodId,
		updatedTitle,
		updatedImageUrl,
		updatedDescription,
		updatedPrice
	)

	updatedProduct.save()

	res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		})
	})
}

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId

	Product.deleteById(prodId)
	res.redirect('/admin/products')
}
