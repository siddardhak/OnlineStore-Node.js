const User = require('../models/user');

exports.getLoginPage = (req, res, next) => {
    //  const isLoggedIn = (req.get('Cookie').split(';')[3].trim().split('=')[1]);
    console.log(req.session.isLoggedIn)
    console.log(req.session.user)
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postLoginPage = (req, res, next) => {
    User.findById('5ec9caf2ec276a0479b923b5')
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user
            res.redirect('/')
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/login')
    });
}
