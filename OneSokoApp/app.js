var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const mongoose = require('mongoose');
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersroute');

const userController = require('./controllers/userscontrollers');
const vendorController = require('./controllers/vendorcontrollers');
const shopController = require('./controllers/shopcontrollers');
const productsController = require('./controllers/productscontrollers');
const { protect, restrictTo } = require('./authMiddleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/onesoko/auth', usersRouter);

// MongoDB connection
const mongoDB = 'mongodb://127.0.0.1/OneSoko';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Load models
const modelDir = path.join(__dirname, 'models');
fs.readdirSync(modelDir).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(modelDir, file));
        console.log(`Loaded ${file} model`);
    }
});

// Verify registered models
const registeredModels = mongoose.modelNames();
console.log('Registered models:', registeredModels);

// Product Routes
app.get('/onesoko/products', productsController.products_list);
app.get('/onesoko/products/:id', productsController.product_detail);
app.post('/onesoko/products', protect, restrictTo('admin', 'vendor'), productsController.product_create);
app.put('/onesoko/products/:id', protect, restrictTo('admin', 'vendor'), productsController.product_update);
app.delete('/onesoko/products/:id', protect, restrictTo('admin'), productsController.product_delete);

// Shop Routes
app.get('/onesoko/shops', shopController.shops_list);
app.get('/onesoko/shops/:id', shopController.shop_detail);
app.post('/onesoko/shops', protect, restrictTo('admin'), shopController.shop_create);
app.put('/onesoko/shops/:id', protect, restrictTo('admin'), shopController.shop_update);
app.delete('/onesoko/shops/:id', protect, restrictTo('admin'), shopController.shop_delete);
app.post('/onesoko/shops/add-product', protect, restrictTo('admin', 'vendor'), shopController.shop_add_product);
app.post('/onesoko/shops/remove-product', protect, restrictTo('admin', 'vendor'), shopController.shop_remove_product);
app.get('/onesoko/shops/near', shopController.shops_near);
app.post('/onesoko/shops/products', shopController.shop_products);
app.post('/onesoko/shops/vendor', protect, restrictTo('admin'), shopController.shop_vendor);

// Vendor Routes
app.get('/onesoko/vendors', vendorController.vendors_list);
app.get('/onesoko/vendors/:id', vendorController.vendor_detail);
app.post('/onesoko/vendors', protect, restrictTo('admin'), vendorController.vendor_create);
app.put('/onesoko/vendors/:id', protect, restrictTo('admin', 'vendor'), vendorController.vendor_update);
app.delete('/onesoko/vendors/:id', protect, restrictTo('admin'), vendorController.vendor_delete);
app.post('/onesoko/vendors/assign-shop', protect, restrictTo('admin'), vendorController.vendor_assign_shop);
app.post('/onesoko/vendors/remove-shop', protect, restrictTo('admin'), vendorController.vendor_remove_shop);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.status === 404 ? 'Route not found' : err.message,
    error: req.app.get('env') === 'development' ? err.stack : {}
  });
});

module.exports = app;