import db from 'db';
import * as Sequelize from 'sequelize';

const PostImages = db.define( "PostImages", {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default PostImages;