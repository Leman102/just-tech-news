//Import Model and datatypes 
const { Model, DataTypes } = require('sequelize');
//import bcrypt package to hash passwords
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');

// create our "User" model
class User extends Model {
    //Set up method to run on istance data(per user) to check password
    checkPassword(loginPw){
        //Using the keyword this, we can access this user's properties, including the password, which was stored as a hashed string
        return bcrypt.compareSync(loginPw, this.password);
    }
};

// define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
            isEmail: true
        }
    },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // this means the password must be at least four characters long
            len: [4]
        }
    }
  },
  {
    //To add hooks must be pass in a new object = hooks
    hooks: {
        // set up beforeCreate lifecycle "hook" functionality in an async function
        async beforeCreate(newUserData){
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        //set up beforeUpdate lifecycle "hook" functionality in an async function
        //need to add an option to the query call  user-routes.js file { individualHooks: true }
        async beforeUpdate(updateUserData) {
            updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
            return updateUserData;
        }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;