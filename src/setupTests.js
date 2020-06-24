import db from 'db';
import userStatusSeed from 'database/seeders/001-userStatus';
import postStatusSeed from 'database/seeders/003-postStatus';
import categoriesSeed from 'database/seeders/004-category';
import User from 'models/user/user.model';
import jwt from 'jsonwebtoken';
import { redisclient } from 'cache';

beforeAll( async () => {
    // start db connection
    await db.authenticate();
} );

beforeEach( async () => {
    // wipe the db clean
    await db.sync( { force: true } );

    // seed few tables
    const qi = await db.getQueryInterface();

    userStatusSeed.up( qi, db.Sequelize );
    postStatusSeed.up( qi, db.Sequelize );
    categoriesSeed.up( qi, db.Sequelize );
} );

afterAll( async () => {
    // close db connection
    await db.close();

    // close redis
    redisclient.FLUSHALL( () => {
        redisclient.quit();
    } );
} );

// -----------------------------------------------------------------------------------

global.generateToken = ( userId, emailId ) => {
    return jwt.sign( { userId, email: emailId }, process.env.JWT_SECRET );
};

global.signup = async ( emailId ) => {
    emailId = emailId ?? "test@g.com";
    const password = "password";

    const user = await User.create( { emailId, password, statusId: 1, firstName: "test" } );
    const token = global.generateToken( user.id, emailId );

    return {
        token,
        emailId,
        password,
        userId: user.id
    };
};