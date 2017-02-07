var express = require('express');
var router = express.Router();
var models = require('../models');
var User = require('../models').User;
var Product = require('../models').Product;
var Order = require('../models').Order;
var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

/* GET home page. */
router.get('/', function(req, res, next) {
	Product.findAll().then(function(product){
		if(req.session.errors)
		{
			var confirmed = req.session.confirmed;
			var login = req.session.errors.cart;
			req.session.errors = "";
			req.session.confirmed = "";
		}
		res.render('index', { title: 'Node-Front', user: req.session.username, loggedIn: req.session.loggedIn, products: product, login: login, confirmed: confirmed});
	});
});

router.get('/register', function(req, res, next){

	res.render('register');
});

router.get('/logout', function(req, res, next){
	req.session.destroy(function(){
		res.redirect('/');
	});
});

router.get('/profile', function(req, res, next){
	res.render('profile', {user: req.session.user});
});

router.get('/ims', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		User.findAll({where: {id: req.session.id}}).then(function(user){
			Product.findAll().then(function(product){
				res.render('ims', {user: req.session.username, loggedIn: req.session.loggedIn, products: product});
			});
		});
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/store', function(req, res, next){
	res.render('store', { user: req.session.username, loggedIn: req.session.loggedIn });
});

router.get('/manage', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		if(req.session.errors)
		{
			var errors = req.session.errors;
			req.session.errors = null;
			res.render('manage', {user: req.session.username, action: "Create", loggedIn: req.session.loggedIn, errors: errors});
		}
		else
		{
			res.render('manage', {user: req.session.username, action: "Create", loggedIn: req.session.loggedIn});
		}
	}
	else
	{
		res.redirect('/');
	}
});

router.post('/checkout', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		res.render('checkout', { user: req.session.username, loggedIn: req.session.loggedIn });
	}
	else
	{
		res.redirect('/')
	}
});

router.get('/cart', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		Order.findAll({where: {user_id: req.session.userId, complete: false}}).then(function(order){
			Product.findAll().then(function(product){
				var cart = [];
				//For each order...
				for(i = 0; i < order.length; i++)
				{
					//Find the matching product...
					for(n = 0; n < product.length; n++)
					{
						if(order[i].product_id == product[n].id)
						{
							var orderId = order[i].id;
							var productId = product[n].id;
							var name = product[n].name;
							var imgPath = product[n].imgPath;
							var quantity = order[i].quantity;
							var price = product[n].price;
							var total = price * quantity;

							cart.push({order: orderId, product: productId, name: name, img: imgPath, quantity: quantity, price: price, total: total});

							break;
						}
					}
				}
				
				res.render('cart', {cart: cart, user: req.session.username, loggedIn: req.session.loggedIn});
			});
		});
	}
	else
	{
		res.redirect('/');
	}
});

router.post('/register', function(req, res, next){
	if(req.body.first == "" || req.body.last == "" || req.body.email == "" || req.body.password == ""|| req.body.password_verify == "")
	{
		res.render('register', {error: {allfields: "**All fields are required"}, values:  
			{
			 first: req.body.first, 
			 last: req.body.last, 
			 email: req.body.email, 
			 password: req.body.password, 
			 password_verify: req.body.password_verify
			}});
	}
	else
	{
		models.User.findAll({where: {email: req.body.email}}).then(function(user){
		if(user.length > 0)
		{
			res.render('register', {error: {email: "**Email is already in use"}, values: 
			{
			 first: req.body.first, 
			 last: req.body.last, 
			 email: req.body.email, 
			 password: req.body.password, 
			 password_verify: req.body.password_verify
			}});
		}
		else if(req.body.password != req.body.password_verify)
		{
			res.render('register', {error: {password: "**Passwords don't match"}, values: 
			{
			 first: req.body.first, 
			 last: req.body.last, 
			 email: req.body.email, 
			 password: req.body.password, 
			 password_verify: req.body.password_verify
			}})
		}
		else
		{
			User.create({ first: req.body.first, last: req.body.last, email: req.body.email, password: req.body.password, token: '0xAE3456', orderCount: 0, admin: true}).then(function(task) {
			  res.redirect('/');
			});
		}
	});
	}
});

router.post('/cart/add', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		//Get all Products
		Product.findAll({where: {id: req.body.id}}).then(function(product){
			//Get all orders existing for this product
			Order.findAll({where: {user_id: req.session.userId, product_id: req.body.id}}).then(function(order){
				//If the query found an order
				if(order.length > 0)
				{
					var newQuantity = order[0].quantity + req.body.quantity;

					Order.update({quantity: newQuantity}, {where: {id: order[0].id}}).then(function(){
						res.redirect('/');
					});
				}
				//If the query didn't find an order
				else
				{
					User.findAll({where: {id: req.session.userId}}).then(function(user){
						Order.create({user_id: req.session.userId, product_id: req.body.id, quantity: req.body.quantity, complete: false, orderNumber: user[0].ordercount}).then(function(){
							res.redirect('/');
						});
					});
					
				}
			});
		});
	}
	else
	{
		req.session.errors = {cart: "Please Log In to continue shopping!"}
		res.redirect('/');
	}
});

router.post('/cart/remove', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		Order.destroy({where: {id: req.body.id}}).then(function(){
			res.redirect('/cart');
		});
	}
	else
	{
		res.redirect('/');
	}
});

router.post('/create', function(req, res, next){
	if(req.files != "" && req.body.name != "" && req.body.description != "" && req.body.quantity != "")
	{
		var imgPath = 'http://localhost:3000/images/' + req.body.name + '.jpg'; 

		req.files.image.mv('./public/images/' + req.body.name + '.jpg', function(err){
			if(err)
			{
				res.send(err);
			}
			else
			{
				Product.create({name: req.body.name, description: req.body.description, quantity: req.body.quantity, price: req.body.price, imgPath: imgPath}).then(function(){
					res.redirect('/ims');
				});
			}
		});
	}
	else
	{
		var image;
		var name;
		var description;
		var price;
		var quantity;

		if(!req.files)
		{
			image = "**Product image is required";
		}
		if(req.body.name == "")
		{
			name = "**Product name is required";
		}
		if(req.body.description == "")
		{
			description = "**Product description is required";
		}
		if(req.body.price == "")
		{
			price = "**Product price is required";
		}
		if(req.body.quantity == "")
		{
			quantity = "**Product description is required";
		}

		req.session.errors = {image: image, name: name, description: description, price: price, quantity: quantity};
		res.redirect('/manage');
	}
});

router.post('/edit', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		Product.findAll({where: {id: req.body.id}}).then(function(product){
			res.render('manage', {action: "Update", product: product[0]});
		});
	}
	else
	{
		res.redirect('/');
	}
});

router.post('/update', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		Product.update({name: req.body.name, description: req.body.description, price: req.body.price, quantity: req.body.quantity},{where: {id: req.body.id}}).then(function(){
			res.redirect('/ims');
		});
	}
});

router.post('/delete', function(req, res, next){
	Product.destroy({where: {id: req.body.id}}).then(function(){
		res.redirect('/ims');
	});
});

router.post('/login', function(req, res, next){
	models.User.findAll({where: {email: req.body.username}}).then(function(user){
		if(user.length > 0)
		{
			//User Authentication goes here
			if(user[0].password != req.body.password)
			{
				res.render('index', {error: {login: "**Invalid email or password"}});
			}
			else
			{
				req.session.username = user[0].first;
				req.session.userId = user[0].id;
				req.session.loggedIn = true;
				res.redirect('/');
			}
		}
		else
		{
			res.render('index', {error: {login: "**Invalid email or password"}});
		}
	});
});

router.post('/purchase', function(req, res, next){
	if(req.session.loggedIn == true)
	{
		stripe.charges.create({
		  amount: req.body.total,
		  currency: "usd",
		  source: req.body.stripeToken
		});

		req.session.confirmed = true;
		res.redirect('/');
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
