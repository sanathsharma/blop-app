import request from 'supertest';
import { app } from 'app';
import {
    PATH_NOT_FOUND_ERROR,
    AUTHENTICATION_FAILED_ERROR,
    YUP_REQUEST_VALIDATION_ERROR
} from '@ssbdev/common';

// ----------------------------------------------------------------------------------------------

const getUsers = () => request( app ).post( "/api/users/get_users" );

// ----------------------------------------------------------------------------------------------

it( 'has route handler for /get_users', async () => {
    const res = await getUsers()
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( PATH_NOT_FOUND_ERROR );
} );

it( 'throws AuthenticationFailedError if no / invalid token is present', async () => {
    const res = await getUsers()
        .send( {} )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( AUTHENTICATION_FAILED_ERROR );
} );

it( 'does not throw AuthenticationFailedError if valid token is found ', async () => {
    const { token } = await global.signup();

    const res = await getUsers()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( AUTHENTICATION_FAILED_ERROR );
} );

it( 'throws RequestValidationError if unwanted data is present in the req body', async () => {
    const { token } = await global.signup();

    const res = await getUsers()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {
            test: "test"
        } )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( YUP_REQUEST_VALIDATION_ERROR );
} );

it( 'gives a list of users if every thing is fine, & password doen not exits on each user', async () => {
    const { token } = await global.signup();

    const res = await getUsers()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    expect( res.body.status ).toBe( "success" );
    expect( res.body.data.users ).toHaveLength( 1 );

    // creating new user
    await global.signup( "test2@g.com" );
    const res2 = await getUsers()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    const users = res2.body.data.users;

    expect( res2.body.status ).toBe( "success" );
    expect( users ).toHaveLength( 2 );

    // each user info should not have password
    for ( let user of users ) {
        expect( user.password ).toBeUndefined();
    }
} );

