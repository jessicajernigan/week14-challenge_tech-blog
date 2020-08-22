const router = require('express').Router();
const { Blogpost, Blogger, Comment } = require('../models');
const withAuth = require('../utils/auth');



// homepage -- display index of all posts
router.get('/', (req, res) => {
  Blogpost.findAll({
    attributes: [
      'id',
      'post_content',
      'title',
      'created_at'
    ],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'blogpost_id', 'blogger_id', 'created_at'],
        include: {
          model: Blogger,
          attributes: ['username']
        }
      },
      {
        model: Blogger,
        attributes: ['username']
      }
    ]
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((Blogpost) => Blogpost.get({ plain: true }));
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// single-Blogpost
router.get('/Blogpost/:id', (req, res) => {
  Blogpost.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_content',
      'title',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: [
          'id', 
          'comment_text', 
          'blogpost_id', 
          'blogger_id', 
          'created_at'],
        include: {
          model: Blogger,
          attributes: ['username']
        }
      },
      {
        model: Blogger,
        attributes: ['username']
      }
    ]
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Blogpost found with this id' });
        return;
      }

      // serialize the data
      const blogpost = dbPostData.get({ plain: true });

      // pass data to template
      res.render('blog-post', {
        blogpost,
        loggedIn: req.session.loggedIn
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login
router.get('/login', (req, res) => {
  // check session variable...if user is logged in redirect to homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  // otherwise render login page
  res.render('login');
});


module.exports = router;