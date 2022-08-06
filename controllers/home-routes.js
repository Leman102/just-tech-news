const router = require('express').Router();
//adding models and sequelize
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

//send response using render to use a template engine
/*
router.get('/', (req, res) => {
    res.render('homepage', {
        id: 1,
        post_url: 'https://handlebarsjs.com/guide/',
        title: 'Handlebars Docs',
        created_at: new Date(),
        vote_count: 10,
        comments: [{}, {}],
        user: {
            username: 'test_user'
        }
    });
});
*/
router.get('/', (req, res) => {
    console.log(req.session)
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        //console.log(dbPostData[0]);
        //serialize the object down to only the properties you need .get({ plain: true}))
        const posts = dbPostData.map(post => post.get({plain: true})); 
        res.render('homepage', {posts});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//login route
router.get('/login', (req, res) => {
    //if login redirect to a specific page
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;