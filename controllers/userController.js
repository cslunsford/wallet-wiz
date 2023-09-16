const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/homepage', (req, res) => {
    res.render('homepage');
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/user', (req, res) => {
    res.render('user');
});

module.exports = router;