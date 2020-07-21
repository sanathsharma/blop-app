import db from 'db';
import * as Sequelize from 'sequelize';
import { deleteMediaFile } from "helpers/deleteMediaFile";

const UserDp = db.define( "UserDp", {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
        afterDestroy ( instance ) {
            deleteMediaFile( instance.url );
        }
    }
} );

export default UserDp;