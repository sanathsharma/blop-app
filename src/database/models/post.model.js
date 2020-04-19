import db from 'db';
import * as Sequelize from 'sequelize';

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

export default Post;