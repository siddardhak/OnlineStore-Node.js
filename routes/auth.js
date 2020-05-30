const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');


const router = express.Router();


router.get('/login', authController.getLoginPage);

router.post('/login', authController.postLoginPage);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignupPage);

router.post('/signup', authController.postSignupPage);

router.get('/resetpassword', authController.getResetPassword);

router.post('/resetpassword', authController.postResetPassword);


module.exports = router;