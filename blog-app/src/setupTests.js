import db from 'db';
import userStatusSeed from 'database/seeders/001-userStatus';
import postStatusSeed from 'database/seeders/003-postStatus';
import categoriesSeed from 'database/seeders/004-category';
import User from 'models/user/user.model';
import { redisclient } from 'cache';
import { tokens } from 'helpers/generateTokens';

beforeAll( async () => {
    // set env variables
    process.env.JWT_ACCESS_SECRET = "test";
    process.env.JWT_REFRESH_SECRET = "test_2";

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

global.generateToken = ( userId, emailId ) => tokens.access.generate( { userId, emailId } );

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