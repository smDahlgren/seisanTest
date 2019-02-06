var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var productSchema   = new Schema({
  sku:{
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  } ,
  price: {
    type: String,
    unique: true,
    required: true
  } ,
  description: {
    type: String,
    unique: true,
    required: true
  },
  qty: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Products', productSchema);
