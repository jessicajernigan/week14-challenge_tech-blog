const router = require('express').Router();
const { Blogger } = require('../../models');


// GET /api/bloggers
router.get('/', (req, res) => {
	// Access our User model and run .findAll() method)
	Blogger.findAll()
		.then(dbBloggerData => res.json(dbBloggerData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// GET /api/bloggers/1
router.get('/:id', (req, res) => {
	Blogger.findOne({
		where: {
			id: req.params.id
		}
	})
		.then(dbBloggerData => {
			if (!dbBloggerData) {
				res.status(404).json({ message: 'User not found.' });
				return;
			}
			res.json(dbBloggerData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});



// POST /api/bloggers
router.post('/', (req, res) => {
	Blogger.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})
		.then(dbBloggerData => res.json(dbBloggerData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});



// PUT /api/bloggers/1
router.put('/:id', (req, res) => {
	Blogger.update(req.body, {
		where: {
			id: req.params.id
		}
	})
		.then(dbBloggerData => {
			if (!dbBloggerData[0]) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(dbBloggerData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// DELETE /api/bloggers/1
router.delete('/:id', (req, res) => {
	Blogger.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(dbBloggerData => {
			if (!dbBloggerData) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(dbBloggerData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;