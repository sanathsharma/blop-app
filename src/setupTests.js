import db from 'db';
import userStatusSeed from 'database/seeders/002-userStatus';
import postStatusSeed from 'database/seeders/003-postStatus';
import categoriesSeed from 'database/seeders/004-category';

beforeAll( () => {
    // start db connection
    db.authenticate();
} );

beforeEach( async () => {
    // wipe the db clean
    await db.sync( { force: true } );
    const qi = db.getQueryInterface();
    userStatusSeed.up( qi, db.Sequelize );
    postStatusSeed.up( qi, db.Sequelize );
    categoriesSeed.up( qi, db.Sequelize );
} );

afterAll( () => {
    // close db connection
    db.close();
} );