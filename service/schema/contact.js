const mongoose = require('mongoose');
const Schema = mongoose.Schema

const contact = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Contact = mongoose.model('Contact', contact);


module.exports = Contact;
