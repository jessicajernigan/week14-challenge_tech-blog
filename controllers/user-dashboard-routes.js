const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blogpost, Blogger, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
  Blogpost.findAll({
    where: {
      // use the ID from the session
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE Blogpost.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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



router.get('/edit/:id', withAuth, (req, res) => {
  Blogpost.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE Blogpost.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      // include the Comment model here:
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
      const Blogpost = dbPostData.get({ plain: true });

      res.render('edit-Blogpost', {
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