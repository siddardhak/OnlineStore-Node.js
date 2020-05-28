const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config()

const session = require('express-session');

const errorController = require('./controllers/error');

const User = require('./models/user');

const MongoDbStore = require('connect-mongodb-session')(session);

const app = express();


const store = new MongoDbStore({
  uri: process.env.MONGOURI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);

mongoose
  .connect(
    process.env.MONGOURI
  )
  .then(result => {
    User.find().then(user => {
      if (!user) {
        const user = new User({
          name: 'siddardha',
          email: 'siddardha@gmail.com',
          cart: {
            items: []
          }
        })
        user.save();
      }
    })

    console.log('connected')
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
