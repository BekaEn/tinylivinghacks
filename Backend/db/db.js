const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure the .env file is loaded

// Create the Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Database user
    process.env.DB_PASSWORD, // Database password
    {
        host: process.env.DB_HOST || 'localhost', // Database host
        port: process.env.DB_PORT || 3306, // Database port
        dialect: 'mysql', // Database dialect
        logging: true, // Enable logging for debugging
    }
);

// Test the database connection
sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;