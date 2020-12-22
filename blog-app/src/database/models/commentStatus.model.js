import db from 'db';
import * as Sequelize from 'sequelize';

const CommentStatus = db.define( "CommentStatus", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default CommentStatus;