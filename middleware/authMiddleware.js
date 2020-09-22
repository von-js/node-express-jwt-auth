const jwt = require('jsonwebtoken');
const User = require('../models/users');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if json web token exist & is verified
  if (token) {
    jwt.verify(token, 'this is a secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      } 
    })
  }
  else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'this is a secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      } 
    });
  }
  else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };