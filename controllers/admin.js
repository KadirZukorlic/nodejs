const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.isLoggedIn
	})
}

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title
	const imageUrl = req.body.imageUrl
	const description = req.body.description
	const price = req.body.price
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user
	})
	product
		.save()
		.then((result) => {
			// console.log(result)
			console.log('Created product')
			res.redirect('/admin/products')
		})
		.catch((err) => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit // => returns "true" or undefined based on if it finds edit in query param
	if (!editMode) {
		return res.redirect('/')
	}

	const prodId = req.params.productId
	Product.findById(prodId).then((product) => {
		if (!product) {
			return res.redirect('/')
		}
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product,
			isAuthenticated: req.isLoggedIn
		})
	})
}

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId // if (editing) in edit-product.ejs we rendered hidden input with name productId, and value="<%= product.id %>" thats why req.body.productId gives us an actual id
	const updatedTitle = req.body.title
	const updatedImageUrl = req.body.imageUrl
	const updatedDescription = req.body.description
	const updatedPrice = req.body.price

	Product.findById(prodId)
		.then((product) => {
			product.title = updatedTitle
			product.price = updatedPrice
			product.description = updatedDescription
			product.imageUrl = updatedImageUrl

			return product.save()
		})
		.then((result) => {
			console.log('UPDATED PRODUCT')
			res.redirect('/admin/products')
		})
		.catch((err) => console.log(err))
}

exports.getProducts = (req, res, next) => {
	Product.find()
		// .select('title price imageUrl -_id') control which fields are returned
		// .populate('userId', 'name') populate related fields
		.then((products) => {
			console.log(products, 'PRODUCTS')
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
				isAuthenticated: req.isLoggedIn
			})
		})
		.catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId

	Product.findByIdAndRemove(prodId)
		.then(() => {
			res.redirect('/admin/products')
		})
		.catch((err) => console.log(err))
	res.redirect('/admin/products')
}

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders
			})
		})
		.catch((error) => console.log(error))
}
