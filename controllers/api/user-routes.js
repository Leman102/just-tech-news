const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');


//Get /api/users
router.get('/', (req, res) => {
    //Access the User model and run .findAll() method (Select * from Users) finALL returns an array
    User.findAll({
        //exclude password info from get requests
        attributes: { exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//Get /api/users/1
router.get('/:id', (req, res) => {
    //access the user model and run .findOne() method (SELECT * FROM users WHERE id = 1)
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }   
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: 'No user found whit this id'});
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


//POST /api/users
router.post('/',  (req, res) => {
    //expects {username: '',email:'',password:''} INSERT INTO users (username, email, password) VALUES    ("leman", "leman@email.com", "abc1234");
    User.create({
        username:req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        //.then(dbUserData => res.json(dbUserData))
        //This gives our server easy access to the user's user_id, username, and a Boolean describing whether or not the user is logged in.
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;
          
                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//POST login route
router.post('/login',  (req, res) => {
    //expects {email"leman@email.com", password:abc1234}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData){
            res.status(400).json({message: 'No user with that email address!'});
            return;
        }
        //verify User 
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!'});
            return;
        }
        //This gives our server easy access to logged in info
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

//add logout route
router.post('/logout',  (req,res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

//PUT /api/users/1
router.put('/:id',  (req, res) => {
    //expects {username: '',email:'',password:''}
    //if req.body has exact key/value pairs to match the model UPDATE users SET username = "leman", email = "leman@email.com", password = "abc1234" WHERE id = 1;
    User.update(req.body, {
        //adding bcrypt hook to hash password when updated
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData[0]) {
                res.status(404).json({message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//DELETE /api/users/1
router.delete('/:id',  (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'No user foound with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;


