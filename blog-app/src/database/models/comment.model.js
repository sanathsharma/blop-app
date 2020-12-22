import db from 'db';
import * as Sequelize from 'sequelize';
import Post from './post/post.model';
import User from './user/user.model';
import CommentStatus from './commentStatus.model';

const Comment = db.define( "Comment", {
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

Comment.belongsTo( Post, { foreignKey: "postId", as: "post" } );
Post.hasMany( Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" } );

Comment.belongsTo( User, { foreignKey: "addedBy", as: "commentedBy" } );

// status
Comment.belongsTo( CommentStatus, { foreignKey: "statusId", as: "status" } );

// commented on post or reply to another comment
Comment.belongsTo( Comment, { foreignKey: "parentId", as: "parent", onDelete: "CASCADE" } );

export default Comment;