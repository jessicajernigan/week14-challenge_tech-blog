const router = require('express').Router();

const bloggerRoutes = require('./blogger-routes.js');
const blogPostRoutes = require('./blog-post-routes.js');
const commentRoutes = require('./comment-routes');

router.use('/bloggers', bloggerRoutes);
router.use('/blogposts', blogPostRoutes)
router.use('/comments', commentRoutes);

module.exports = router;