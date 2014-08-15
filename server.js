var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/*Mongo Scheme */

var produceSchema = new mongoose.Schema({
  _id: Number,
  produceName: String,
  type: String,
  image: String,
});

var listingSchema = new mongoose.Schema({
  userName: String,
  title: String,
  produceName: String,
  quantity: Number,
  price: Number,
  description: String,
  date: Date
});

var userSchema = new mongoose.Schema({
  email: { type: String, index: { unique: true }},
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Produce = mongoose.model('Produce', produceSchema);
var Listing = mongoose.model('Listing', listingSchema);

/* Passport session to keep user signed in */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({usernameField: 'email' },
 function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      console.log(user.password);
      if (err) return done(err);
      if (!user) return done(null, false, {message: 'Incorrect Username'});
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if (isMatch) return done(null, user);
        return done(null, false);
    });
  });
}));

mongoose.connect('mongodb://admin:password@ds061189.mongolab.com:61189/onthegrow');

/*Express Middleware*/

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'www')));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

app.get('/api/logout', function(req, res) {
  req.logout();
  res.send(200);
});

app.post('/api/signup', function(req, res, next) {
  /* Implement error code 11000 */
  console.log(req.body.email);
  console.log(req.body.password);
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});


app.get('/api/lists', function(req, res) {
    var query = Listing.find();
    query.limit(50);
    query.exec(function(err, lists) {
      if (err) return next(err);
      res.send(lists);
  });
});

app.get('/api/lists/:id', function(req, res, next) {
  Listing.findById(req.params.id, function(err, list) {
    if (err) return next(err);
    res.send(list);
  });
});

app.get('/api/userlistings', function(req, res) {
    var query = Listing.find({ userName: req.user.email});
    query.limit(50);
    query.exec(function(err, lists) {
      if (err) return next(err);
      res.send(lists);
  });
});

app.post('/api/lists', function(req, res) {
  var listing = new Listing({
    userName: req.body.userName,
    title: req.body.title,
    produceName: req.body.produceName,
    quantity: req.body.quantity,
    price: req.body.price,
    date: req.body.date,
    description: req.body.description
  })
  listing.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
})

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});