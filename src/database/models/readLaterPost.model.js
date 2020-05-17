import db from "db";
import Post from "./post/post.model";
import User from "./user/user.model";

const ReadLaterPost = db.define( "ReadLaterPost", {} );

ReadLaterPost.belongsTo( Post, { foreignKey: "postId", as: "post" } );
ReadLaterPost.belongsTo( User, { foreignKey: "addedBy", as: "user" } );

export default ReadLaterPost;