var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var mongoose   = require('mongoose');
var path = require('path');
var request = require("request");

require('dotenv').config()

var morgan = require('morgan');

// set up view engine
// =============================================================================
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static('public'));

// env vars
// =============================================================================
var port = process.env.PORT || 3000;
var DB_UN = process.env.DB_UN;
var DB_PW = process.env.DB_PW;
var URL_VAR = 'https://seisan-test.herokuapp.com/';

var Products     = require('./models/products.js');
var Contact      = require('./models/contact.js');

// configure app to use bodyParser()
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log every request to the console

// connect to db
// =============================================================================
mongoose.connect(`mongodb://${DB_UN}:${DB_PW}@ds263670.mlab.com:63670/seisan-test`, { useNewUrlParser: true });

// get instance of app and set router middleware
// =============================================================================
var router = express.Router();  // get an instance of the express Router
app.use('/api', router);

// api routes
// =============================================================================
router.get('/products', (req, res) => {
  Products.find(function(err, products) {
    if (err)
    res.send(err);
    res.json(products);
  });
});

router.get('/contact', (req, res) => {
  Contact.find(function(err, products) {
    if (err)
    res.send(err);
    res.json(products);
  });
});

router.get('/products/sku/:sku', (req, res) => {

  Products.find({sku: {$regex: req.params.sku}})
  .exec()
  .then(doc => {
    res.json(doc)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.get('/products/name/:name', (req, res) => {
  // console.log(req.params.name);
  Products.find({name: {$regex: req.params.name}})
  .exec()
  .then(doc => {
    res.json(doc)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/contact/:body', (req, res) => {

  var data = req.params.body;
  var cleanData = data.replace("&20", " ");
  var contact = new Contact({
    body: cleanData
  });
  // console.log(cleanData);

  contact.save()
  .then(item => {
    res.send("Feedback heard!");
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  })
});

// front end routes
// =============================================================================

app.get('/', (req, res, next) => {
  res.render("form")
})

app.get('/products/name/:name', (req, res, next) => {

  // console.log(req.params.name);

  var products = { method: 'GET',
  url: `${URL_VAR}api/products/name/${req.params.name}`,
  headers:
  {'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  // console.log(products);

  request(products, function (error, response, body) {
    if (error) throw new Error(error);
    // console.log(body);

    res.render('searchRender', { title: "Products by name", array: JSON.parse(body) } );
  });

})

app.get('/products/sku/:sku', (req, res, next) => {

  var products = { method: 'GET',
  url: `${URL_VAR}api/products/sku/${req.params.sku}`,
  headers:
  {'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(products, function (error, response, body) {
    if (error) throw new Error(error);

    res.render('searchRender', { title: "Products by sku", array: JSON.parse(body) } );
  });

});

app.get('/contact', (req, res, next) => {
  res.render("contact")
})

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
