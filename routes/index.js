var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err,docs) {
    var productChunks = [];
    var chunksize = 3;
    for(var i=0;i<docs.length;i+=chunksize){
       productChunks.push(docs.slice(i,i+chunksize));
    }
    res.render('shop/index', { title: 'Shopping Cart',products:productChunks,successMsg:successMsg,noMessages:!successMsg});
  });
});

router.get('/add-to-cart/:id',function (req,res,next) {
   var productId = req.params.id;
   var cart = new Cart(req.session.cart?req.session.cart:{});
   Product.findById(productId,function (err, product) {
       if(err){
         return res.redirect('/');
       }
        cart.add(product,productId);
       req.session.cart = cart;
       res.redirect('/');
   });
});

router.get('/add/:id',function (req,res,next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.addByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/reduce/:id',function (req,res,next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id',function (req,res,next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart',function (req,res,next) {
   if(!req.session.cart){
      return res.render('shop/shopping-cart',{products:null});
   }
   var cart = new Cart(req.session.cart);
   console.log(cart);
   res.render('shop/shopping-cart',{products:cart.generatedArray(),totalPrice:cart.totalPrice});
});


router.get('/checkout',isLoggedIn,function (req,res,next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout',{total:cart.totalPrice,errMsg:errMsg,noError:!errMsg});

});

router.post('/checkout',isLoggedIn,function (req,res,next) {

    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_n1LpEAoHKUe9BmqsRkDPDHgO"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            req.flash('success', 'Successfully bought product');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}