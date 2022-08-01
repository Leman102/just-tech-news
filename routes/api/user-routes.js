const router = require('express').Router();
const { User } = require('../../models');

//Get /api/users
router.get('/', (req, res) => {
    //Access the User model and run .findAll() method (Select * from Users)
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
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        }
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
router.post('/', (req, res) => {
    //expects {username: '',email:'',password:''} INSERT INTO users (username, email, password) VALUES    ("leman", "leman@email.com", "abc1234");
    User.create({
        username:req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//PUT /api/users/1
router.put('/:id', (req, res) => {
    //expects {username: '',email:'',password:''}
    //if req.body has exact key/value pairs to match the model UPDATE users SET username = "leman", email = "leman@email.com", password = "abc1234" WHERE id = 1;
    User.update(req.body, {
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
router.delete('/:id', (req, res) => {
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


