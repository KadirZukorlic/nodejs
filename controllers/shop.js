const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products'
			})
		})
		.catch((err) => console.log(err))
}

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId
	// Product.findAll({ where: { id: prodId } })
	// 	.then((products) => {
	// 		res.render('shop/product-detail', {
	// 			product: products[0],
	// 			pageTitle: products[0].title,
	// 			path: '/products'
	// 		})
	// 	})
	// 	.catch((err) => console.log(err))
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products'
			})
		})
		.catch((err) => console.log(err))
}

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/'
			})
		})
		.catch((err) => console.log(err))
}

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((products) => {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products
			})
		})
		.catch((err) => console.log(err))
}

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId // productId is name on hidden input
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product)
		})
		.then((result) => {
			res.redirect('/cart')
			console.log(result)
		})
		.catch((err) => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId
	req.user
		.deleteItemFromCart(prodId)
		.then((result) => {
			console.log(result, 'RESULT IN CART DELETE')
			res.redirect('/cart')
		})
		.catch((error) => {
			console.log(error)
		})
}

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	})
}

exports.postOrder = (req, res, next) => {
	let fetchedCart = []
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart
			return cart.getProducts()
		})
		.then((products) => {
			return req.user
				.createOrder()
				.then((order) => {
					order.addProducts(
						products.map((product) => {
							product.orderItem = { quantity: product.cartItem.quantity }
							return product
						})
					)
				})
				.catch((error) => console.log(error))
		})
		.then((result) => {
			return fetchedCart.setProducts(null)
		})
		.then((result) => {
			res.redirect('/orders')
		})
		.catch((error) => {
			console.log(error)
		})
}

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ['products'] })
		.then((orders) => {
			console.log(orders)
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders
			})
		})
		.catch((error) => console.log(error))
}
