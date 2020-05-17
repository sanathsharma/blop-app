import { hash } from 'bcryptjs';
import db from 'db';
import { STRING } from 'sequelize';
import UserDp from './userDp.model';
import UserStatus from './userStatus.model';


const User = db.define( 'User', {
    emailId: {
        type: STRING,
        allowNull: false,
        validate: { isEmail: { msg: 'Invalid Email ID.' } },
        // unique: true
    },
    password: {
        type: STRING,
        allowNull: false,
        validate: {
            lencheck ( val ) {
                if ( val.length < 8 ) throw new Error( "Length of password should be greater than or equal to 8." );
            }
        }
    },
    firstName: {
        type: STRING,
        allowNull: false,
    },
    lastName: {
        type: STRING,
        allowNull: true
    },
    bio: {
        type: STRING,
        allowNull: true
    }
}, {
    hooks: {
        beforeCreate: hashPassword,
        beforeBulkUpdate: async ( users, options ) => {
            // ? users will always be a single object, which makes impact while chenging if multiple users are being affected
            if ( users.fields.includes( 'password' ) ) {
                users['attributes']['password'] = await hash( users['attributes']['password'], 12 );
            }
        },
        beforeUpdate ( user, options ) {
            if ( user.changed( 'password' ) ) hashPassword( user, options );
        }
    },
    modelName: 'User',
    indexes: [
        { fields: ['statusId', 'emailId'], unique: true }
    ]
} );

async function hashPassword ( user, options ) {
    user['password'] = await hash( user['password'], 12 );
}

UserStatus.hasMany( User, { foreignKey: "statusId" } );
User.belongsTo( UserStatus, { foreignKey: "statusId", as: "status" } );

UserDp.hasOne( User, { foreignKey: "dpId", onDelete: "SET NULL", hooks: true } );
User.belongsTo( UserDp, { foreignKey: "dpId", as: "dp" } );

export default User;