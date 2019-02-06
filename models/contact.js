var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var contactSchema   = new Schema({
  body: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Contact', contactSchema);
