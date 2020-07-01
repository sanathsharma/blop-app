import db from 'db';
import { DataTypes } from 'sequelize';
import UserDp from './userDp.model';
import UserStatus from './userStatus.model';
import { hash } from 'bcryptjs';

const User = db.define( 'User', {
    emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: { msg: 'Invalid Email ID.' } }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            lencheck ( val ) {
                if ( val.length < 8 ) throw new Error( "Length of password should be greater than or equal to 8." );
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get () {
            return `${ this.firstName } ${ this.lastName }`;
        },
        set ( value ) {
            throw new Error( "Should not set fullName" );
        }
    },
    bio: {
        type: DataTypes.STRING,
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
    modelName: 'User'
} );

async function hashPassword ( user, _options ) {
    user['password'] = await hash( user['password'], 12 );
}

UserStatus.hasMany( User, { foreignKey: "statusId" } );
User.belongsTo( UserStatus, { foreignKey: "statusId", as: "status" } );

UserDp.hasOne( User, { foreignKey: "dpId", onDelete: "SET NULL", hooks: true } );
User.belongsTo( UserDp, { foreignKey: "dpId", as: "dp" } );

export default User;