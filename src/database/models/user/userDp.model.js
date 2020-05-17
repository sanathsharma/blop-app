import db from 'db';
import * as Sequelize from 'sequelize';

const UserDp = db.define( "UserDp", {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default UserDp;