const router = require('express').Router();
const { Blogger, Blogpost, Comment } = require('../../models');
const userAuth = require('../../utils/auth'); // Authenticate user session middleware.


// GET /api/bloggers (retrieve all bloggers)
router.get('/', (req, res) => {
	// Access our User model and run .findAll() method)
	Blogger.findAll({
		attributes: { exclude: ['password'] } // Preserve users' privacy.
	})
		.then((dbBloggerData) => res.json(dbBloggerData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});


// GET /api/bloggers/1 (retrieve one blogger by id)
router.get('/:id', (req, res) => {
	Blogger.findOne({
		attributes: { exclude: ['password'] },
		where: {
			id: req.params.id
		},
		include: [
			{
				model: Post,
				attributes: ['id', 'title', 'post_content', 'created_at']
			},
			{
				model: Comment,
				attributes: ['id', 'comment_text', 'created_at'],
				include: {
					model: Post,
					attributes: ['title']
				}
			}
		]
	})
		.then((dbBloggerData) => {
			if (!dbBloggerData) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}
			res.json(dbBloggerData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});



// POST /api/bloggers -- create a new user on signup
router.post('/', (req, res) => {
	Blogger.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})
		//
		.then((dbBloggerData) => {
			req.session.save(() => {
				req.session.blogger_id = dbBloggerData.id;
				req.session.username = dbBloggerData.username;
				req.session.loggedIn = true;

				res.json(dbBloggerData);
			});
		});
});



// PUT /api/bloggers/1
router.put('/:id', userAuth, (req, res) => {
	Blogger.update(req.body, {
		individualHooks: true,
		where: {
			id: req.params.id
		}
	})
		.then((dbBloggerData) => {
			if (!dbBloggerData[0]) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(dbBloggerData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});



router.delete('/:id', userAuth, (req, res) => {
	Comment.destroy({
		where: {
			blogger_id: req.params.id
		}
	}).then(() => {
		Blogger.destroy({
			where: {
				id: req.params.id
			}
		})
			.then((dbBloggerData) => {
				if (!dbBloggerData) {
					res.status(404).json({ message: 'No user found with this id' });
					return;
				}
				res.json(dbBloggerData);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	});
});

// login
router.post('/login', (req, res) => {
	// find user based on email
	Blogger.findOne({
		where: {
			email: req.body.email
		}
	}).then((dbBloggerData) => {
		if (!dbBloggerData) {
			res.status(400).json({ message: 'No user with that email address!' });
			return;
		}

		// validate password
		const validPassword = dbBloggerData.checkPassword(req.body.password);

		if (!validPassword) {
			res.status(400).json({ message: 'Incorrect password!' });
			return;
		}

		// initiate creation of session and grab values for session variables from db
		req.session.save(() => {
			// declare session variables
			req.session.blogger_id = dbBloggerData.id;
			req.session.username = dbBloggerData.username;
			req.session.loggedIn = true;

			res.json({ user: dbBloggerData, message: 'You are now logged in!' });
		});
	});
});

// logout -- if user is loggedIn, destroy session variables and reset cookie to clear session, then send res back to client so it can redirect user to homepage
router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});



// // POST /api/bloggers
// router.post('/', (req, res) => {
// 	Blogger.create({
// 		username: req.body.username,
// 		email: req.body.email,
// 		password: req.body.password
// 	})
// 		.then(dbBloggerData => res.json(dbBloggerData))
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json(err);
// 		});
// });



// // PUT /api/bloggers/1
// router.put('/:id', (req, res) => {
// 	Blogger.update(req.body, {
// 		where: {
// 			id: req.params.id
// 		}
// 	})
// 		.then(dbBloggerData => {
// 			if (!dbBloggerData[0]) {
// 				res.status(404).json({ message: 'No user found with this id' });
// 				return;
// 			}
// 			res.json(dbBloggerData);
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json(err);
// 		});
// });

// // DELETE /api/bloggers/1
// router.delete('/:id', (req, res) => {
// 	Blogger.destroy({
// 		where: {
// 			id: req.params.id
// 		}
// 	})
// 		.then(dbBloggerData => {
// 			if (!dbBloggerData) {
// 				res.status(404).json({ message: 'No user found with this id' });
// 				return;
// 			}
// 			res.json(dbBloggerData);
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json(err);
// 		});
// });

module.exports = router;