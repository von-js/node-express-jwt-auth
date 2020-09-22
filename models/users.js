const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    require: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 char']
  }
});

// fire a function after a user is saved to db
Schema.post('save', function(doc, next){
  console.log('new user was created and save', doc);
  next();
})

// fire a function before a document is save
Schema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// static method to login user
Schema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  } 
  throw Error('incorrect email');
}

const User = mongoose.model('user', Schema);
module.exports = User;