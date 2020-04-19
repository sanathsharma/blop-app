import db from 'db';
import * as Sequelize from 'sequelize';

const Comment = db.define( "Comment", {
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default Comment;