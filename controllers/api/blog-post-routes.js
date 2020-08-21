const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Blogpost, Blogger } = require('../../models');
// const withAuth = require('../../utils/auth');


// GET posts by all users
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
    // include: [
    //   // include the Comment model here:
    //   {
    //     model: Comment,
    //     attributes: ['id', 'comment_text', 'post_id', 'blogger_id', 'created_at'],
    //     include: {
    //       model: Blogger,
    //       attributes: ['username']
    //     }
    //   },
    //   {
    //     model: Blogger,
    //     attributes: ['username']
    //   }
    // ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// GET post by id
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
    // include: [
    //   // include the Comment model here:
    //   {
    //     model: Comment,
    //     attributes: ['id', 'comment_text', 'post_id', 'blogger_id', 'created_at'],
    //     include: {
    //       model: Blogger,
    //       attributes: ['username']
    //     }
    //   },
    //   {
    //     model: Blogger,
    //     attributes: ['username']
    //   }
    // ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// Create a post
router.post('/', (req, res) => {
  Blogpost.create({
    title: req.body.title,
    post_content: req.body.post_content,
    blogger_id: req.body.blogger_id
  })
    .then((newBlogPost) => res.json(newBlogPost))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});




// Update a post title
router.put('/:id', (req, res) => {
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


// Delete a post
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((blogPostDeleted) => {
      if (!blogPostDeleted) {
        res.status(404).json({ message: 'No post found with this id' });
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