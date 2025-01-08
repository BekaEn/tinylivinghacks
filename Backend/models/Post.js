const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thumbnail_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    meta_desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING, // Add this field for categories
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Post;