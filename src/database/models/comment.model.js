import db from 'db';
import * as Sequelize from 'sequelize';
import Post from './post/post.model';
import User from './user/user.model';

const Comment = db.define( "Comment", {
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

Comment.belongsTo( Post, { foreignKey: "postId", as: "post" } );
Post.hasMany( Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" } );

Comment.belongsTo( User, { foreignKey: "addedBy", as: "user" } );

export default Comment;