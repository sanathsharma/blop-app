// vendors
import { truncate } from "lodash";
import { ServerError } from "@ssbdev/common";
import * as Sequelize from 'sequelize';

// db
import db from 'db';

// models
import PostImage from 'models/post/postImage.model';
import User from 'models/user/user.model';
import Category from 'models/category.model';
import PostStatus from 'models/post/postStatus.model';

// constants
import { POST_SHORT_DESCRIPTION_LENGTH } from "constants/app.constants";

// ------------------------------------------------------------------------------------
// model defination

const Post = db.define( "Post", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    shortDescription: {
        type: Sequelize.VIRTUAL,
        get () {
            return truncate( this.description, {
                length: POST_SHORT_DESCRIPTION_LENGTH
            } );
        },
        set () {
            throw new ServerError( "Should not set \"shortDescriptions\"" );
        }
    }
} );

// ------------------------------------------------------------------------------------
// associations

// todo: test cascade deletion of post -> deletes postImage ??
Post.belongsTo( PostImage, { foreignKey: "imageId", as: "image", onDelete: "CASCADE", hooks: true } );
Post.belongsTo( User, { foreignKey: "addedBy", as: "author" } );
Post.belongsTo( PostStatus, { foreignKey: "statusId", as: "status" } );

Post.belongsTo( Category, { foreignKey: "categoryId", as: "category" } );
Category.hasMany( Post, { foreignKey: "categoryId", as: "posts", onDelete: "CASCADE" } );

export default Post;