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
        defaultValue: '', // Default empty string
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Post;