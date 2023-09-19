const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    const logged_in = req.session.logged_in || false;
    res.render('homepage', { logged_in });
});

router.get('/homepage', (req, res) => {
    const logged_in = req.session.logged_in || false;
    res.render('homepage', { logged_in });
});

router.get('/dashboard', withAuth, (req, res) => {
    const logged_in = req.session.logged_in || false;
    res.render('dashboard', { logged_in });
});

router.get('/register', (req, res) => {
    const logged_in = req.session.logged_in || false;
    res.render('register', { logged_in });
});

module.exports = router;