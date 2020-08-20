const router = require('express').Router();

const userRoutes = require('./blogger-routes.js');

router.use('/bloggers', userRoutes);

module.exports = router;
