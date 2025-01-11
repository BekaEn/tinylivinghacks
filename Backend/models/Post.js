const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    image_url: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for additional images
      },
}, {
    timestamps: true,
});

module.exports = Post;