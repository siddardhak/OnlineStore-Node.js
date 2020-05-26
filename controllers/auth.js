exports.getLoginPage = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login'
    })
}

exports.postLoginPage = (req, res, next) => {
    const Email = req.body.email;
    const Password = req.body.password;
    console.log(Email, Password);
    res.redirect('/login')
}
