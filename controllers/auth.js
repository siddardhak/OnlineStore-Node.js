const User = require('../models/user');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const nodemailer = require('nodemailer');

const sendgrid = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: process.env.API_KEY
    }
}))

exports.getLoginPage = (req, res, next) => {
    let message = req.flash('errorMessage')
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    //  const isLoggedIn = (req.get('Cookie').split(';')[3].trim().split('=')[1]);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    })
}

exports.postLoginPage = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('errorMessage', 'Invalid Email or Password');
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password).then(result => {
                if (result) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save((err) => {
                        if (err) {
                            console.log(err)
                        }
                        return res.redirect('/')

                    })
                }
                else {
                    req.flash('errorMessage', 'Invalid Email or Password');
                    return res.redirect('/login')
                }
            }).catch(err => {
                console.log(err)
                res.redirect('/login')
            })
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

exports.getSignupPage = (req, res, next) => {
    let message = req.flash('errorMessage')
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message
    })
}

exports.postSignupPage = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;
    User.findOne({ email: email }).then(userDocument => {
        if (userDocument) {
            req.flash('errorMessage', 'Email already exists')
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {
                        items: []
                    }
                });
                return user.save().then(result => {
                    res.redirect('/login')
                    console.log('created user')
                    return transporter.sendMail({
                        to: email,
                        from: process.env.FROMADDRESS,
                        subject: 'Welcome to Toy Store',
                        html: '<p>Thank you for signingup. Your Account is successfully created in Toy Store</p>'
                    }).then(result => {

                    }).catch(err => {
                        console.log(err)
                    })

                });
            })
    }).catch(err => {
        console.log(err)
    })
}

exports.getResetPassword = (req, res, next) => {
    let message = req.flash('errorMessage');
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/reset', {
        pageTitle: 'Password Reset',
        path: '/resetpassword',
        errorMessage: message
    })
}

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/resetpassword')
        }
        console.log(buffer)
        const token = buffer.toString('hex');
        User.findOne({ email: email }).then(user => {
            if (!user) {
                req.flash('errorMessage', 'No User found this Email');
                return res.redirect('/resetpassword')
            }
            user.resetToken = token;
            user.resetTokenExpire = Date.now() + 3600000;
            return user.save().then(result => {
                res.redirect('/')
                return transporter.sendMail({
                    to: req.body.email,
                    from: process.env.FROMADDRESS,
                    subject: 'Password Reset',
                    html: `<p>You requested for password Reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> for password reset</p>`
                }).then(result => {

                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            console.log(err)
        })

    })

}
