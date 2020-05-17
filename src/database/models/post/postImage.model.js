import db from 'db';
import * as Sequelize from 'sequelize';

const PostImage = db.define( "PostImage", {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default PostImage;