//import Sequelize
const Sequelize = require('sequelize');

//import env file
require('dotenv').config();

//Create connection to database, pass in your MySQL information for username and password
const sequelize =  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;
