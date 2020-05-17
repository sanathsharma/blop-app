import db from "db";
import Post from "./post/post.model";
import User from "./user/user.model";

const FavoritePost = db.define( "FavoritePost", {} );

// todo: postId and addedBy unique together
FavoritePost.belongsTo( Post, { foreignKey: "postId", as: "post" } );
FavoritePost.belongsTo( User, { foreignKey: "addedBy", as: "user" } );

export default FavoritePost;