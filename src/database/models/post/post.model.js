import db from 'db';
import * as Sequelize from 'sequelize';

// models
import PostImage from './postImage.model';
import User from 'models/user/user.model';
import Category from 'models/category.model';
import PostStatus from './postStatus.model';

const Post = db.define( "Post", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

// todo: test cascade deletion of post -> deletes postImage ??
Post.belongsTo( PostImage, { foreignKey: "imageId", as: "image", onDelete: "CASCADE" } );
Post.belongsTo( User, { foreignKey: "addedBy", as: "author" } );
Post.belongsTo( PostStatus, { foreignKey: "statusId", as: "status" } );

Post.belongsTo( Category, { foreignKey: "categoryId", as: "category" } );
Category.hasMany( Post, { foreignKey: "categoryId", as: "posts", onDelete: "CASCADE" } );

export default Post;