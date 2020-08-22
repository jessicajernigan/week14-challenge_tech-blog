const router = require('express').Router();
const { Blogpost, Blogger, Comment } = require('../models');
const userAuth = require('../utils/auth'); // Authenticate user session middleware.

router.get('/', userAuth, (req, res) => {
  Blogpost.findAll({
    where: {
      // use the ID from the session
      blogger_id: req.session.blogger_id
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
    .then(dbPostData => {
      // serialize data before passing to template
      const posts = dbPostData.map(Blogpost => Blogpost.get({ plain: true }));
      res.render('dashboard', {
        posts,
        loggedIn: true
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



router.get('/edit/:id', userAuth, (req, res) => {
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
    .then(dbPostData => {
      // serialize data before passing to template
      const post = dbPostData.get({ plain: true });

      res.render('edit-blog-post', {
        Blogpost,
        loggedIn: true
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;