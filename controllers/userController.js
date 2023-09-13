const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/dashboard', withAuth, (req, res) => {
    res.render('dashboard', { balance: req.session.balance });
});