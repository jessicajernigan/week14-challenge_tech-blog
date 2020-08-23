const router = require('express').Router();
const { Blogpost, Blogger, Comment } = require('../../models');
const userAuth = require('../../utils/auth'); // Authenticate user session middleware.


// GET all blog posts by all users
router.get('/', (req, res) => {
  console.log('======================');
  Blogpost.findAll({
    order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'title',
      'post_content',
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// GET blog post by id
router.get('/:id', (req, res) => {
  Blogpost.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'post_content',
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
      if (!dbPostData) {
        res.status(404).json({ message: 'Blog post not found.' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// POST (create) a blog post
router.post('/', userAuth, (req, res) => {
  Blogpost.create({
    title: req.body.title,
    post_content: req.body.post_content,
    blogger_id: req.session.blogger_id
  })
    .then((newBlogPost) => res.json(newBlogPost))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});




// PUT (update) a post title and/or content
router.put('/:id', userAuth, (req, res) => {
  Blogpost.update(
    {
      title: req.body.title,
      post_content: req.body.post_content
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then((updatedBlogPost) => {
      if (!updatedBlogPost) {
        res.status(404).json({ message: 'Post not found.' });
        return;
      }
      res.json(updatedBlogPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// DELETE a blog post
router.delete('/:id', userAuth, (req, res) => {
  Blogpost.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((blogPostDeleted) => {
      if (!blogPostDeleted) {
        res.status(404).json({ message: 'Post not found.' });
        return;
      }
      res.json(blogPostDeleted);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});




module.exports = router;