// Import the Sequelize constructor from the library.
const Sequelize = require('sequelize');

// Load environment variables.
require('dotenv').config();


// Create connection to the database, pass in MySQL credentials for username and password.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;
