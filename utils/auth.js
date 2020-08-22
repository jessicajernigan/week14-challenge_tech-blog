const userAuth = (req, res, next) => {
  if (!req.session.blogger_id) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = userAuth;