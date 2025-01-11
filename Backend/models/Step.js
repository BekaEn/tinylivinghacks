const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Adjust the path based on your folder structure

const Step = sequelize.define('Step', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts', // Name of the table in the database
            key: 'id',
        },
        onDelete: 'CASCADE', // Ensures steps are deleted if the associated post is deleted
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'steps',
    timestamps: false, // Disable automatic timestamps
});

module.exports = Step;