import db from 'db';
import * as Sequelize from 'sequelize';

const UserStatus = db.define( "UserStatus", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default UserStatus;