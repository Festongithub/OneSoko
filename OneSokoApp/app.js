var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersroute');
// Ensure models are registered
require('./models/products');
require('./models/shop');
require('./models/vendor');
require('./models/users');

var app = express();

const userController = require('./controllers/userscontrollers');
const vendorController = require('./controllers/vendorcontrollers');
const shopController = require('./controllers/shopcontrollers');
const productController = require('./controllers/productscontrollers');

// Database connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", "false");

const mongoDB = "mongodb://127.0.0.1/OneSokoDb";

main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}


// User Routes
app.post('/api/users/wishlist/add', userController.users_wishlist_add);
app.post('/api/users/wishlist/remove', userController.users_wishlist_remove);
app.get('/api/users/wishlist/:id', userController.users_wishlist_get);
app.post('/api/users/cart/add', userController.users_cart_add);
app.post('/api/users/cart/remove', userController.users_cart_remove);
app.get('/api/users/cart/:id', userController.users_cart_get);

// Vendor Routes
app.get('/api/vendors', vendorController.vendors_list);
app.get('/api/vendors/:id', vendorController.vendor_detail);
app.post('/api/vendors', vendorController.vendor_create);
app.put('/api/vendors/:id', vendorController.vendor_update);
app.delete('/api/vendors/:id', vendorController.vendor_delete);
app.post('/api/vendors/assign-shop', vendorController.vendor_assign_shop);
app.post('/api/vendors/remove-shop', vendorController.vendor_remove_shop);

// Shop Routes
app.get('/api/shops', shopController.shops_list);
app.get('/api/shops/:id', shopController.shop_detail);
app.post('/api/shops', shopController.shop_create);
app.put('/api/shops/:id', shopController.shop_update);
app.delete('/api/shops/:id', shopController.shop_delete);
app.post('/api/shops/add-product', shopController.shop_add_product);
app.post('/api/shops/remove-product', shopController.shop_remove_product);
app.get('/api/shops/near', shopController.shops_near);
app.post('/api/shops/products', shopController.shop_products);
app.post('/api/shops/vendor', shopController.shop_vendor);

// Product Routes
app.get('/api/products', productController.product_list);
app.get('/api/products/:id', productController.product_detail);
app.post('/api/products', productController.product_create);
app.put('/api/products/:id', productController.product_update);
app.delete('/api/products/:id', productController.product_delete);
app.post('/api/products/add-to-shop', productController.product_add_to_shop);
app.get('/api/products/name-price', productController.product_name_price);
app.get('/api/products/name-descriptions', productController.product_name_descriptions);
app.get('/api/products/name-stock-status', productController.product_name_stock_status);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
