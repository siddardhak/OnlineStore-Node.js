exports.getLoginPage = (req, res, next) => {
    //  const isLoggedIn = (req.get('Cookie').split(';')[3].trim().split('=')[1]);
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: false
    })
}

exports.postLoginPage = (req, res, next) => {
    const Email = req.body.email;
    const Password = req.body.password;
    req.session.isLoggedIn = true
    res.redirect('/')
}
