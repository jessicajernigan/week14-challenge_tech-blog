const router = require('express').Router();
const { Comment } = require('../../models');
const userAuth = require('../../utils/auth'); // Authenticate user session middleware.

// GET all comments
router.get('/', (req, res) => {
  Comment.findAll({
    attributes: [
      'id', 
      'comment_text', 
      'blogger_id', 
      'blogpost_id']
  })
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// POST (create) a comment
router.post('/', userAuth, (req, res) => {
  // Check the session to verify user is logged in
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      blogpost_id: req.body.blogpost_id,
      blogger_id: req.session.blogger_id
    })
      .then((newComment) => res.json(newComment))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});


// DELETE a comment
router.delete('/:id', userAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((commentDeleted) => {
      if (!commentDeleted) {
        res.status(400).json({ message: 'Comment not found.' });
        return;
      }
      res.json(commentDeleted);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});



module.exports = router;