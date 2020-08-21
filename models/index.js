const Blogger = require('./Blogger');
const Blogpost = require('./Blogpost');
const Comment = require('./Comment');


// Bloggers can create any number of posts and comments.
Blogger.hasMany(Blogpost, {
  foreignKey: 'blogger_id'
});

Blogger.hasMany(Comment, {
  foreignKey: 'blogger_id'
});


// Blog posts can accrue any number of comments, but can only have one creator.
Blogpost.belongsTo(Blogger, {
  foreignKey: 'blogger_id',
});

Blogpost.hasMany(Comment, {
  foreignKey: 'blogpost_id'
});


// Each comment has one creator and is tied to a single post. 
Comment.belongsTo(Blogger, {
  foreignKey: 'blogger_id'
});

Comment.belongsTo(Blogpost, {
  foreignKey: 'blogpost_id'
});


module.exports = { Blogger, Blogpost, Comment };