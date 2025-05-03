var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Some page*/
router.get('/some', function(req, res, next) {
  res.render('index', { title: 'Onesoko' });
});
module.exports = router;
