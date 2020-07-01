import request from 'supertest';
import { app } from 'app';
import {
    PATH_NOT_FOUND_ERROR,
    AUTHENTICATION_FAILED_ERROR,
    YUP_REQUEST_VALIDATION_ERROR
} from '@ssbdev/common';

// ----------------------------------------------------------------------------------------------

describe( 'get_users', () => {

    const getUsersUrl = "/api/users/get_users";

    const getUsers = ( body = {}, token ) =>
        request( app )
            .post( getUsersUrl )
            .set( "Authorization", token ? `Bearer ${ token }` : "" )
            .send( body )
            .expect( 200 );

    // -------------------------------------------------------------------------------------------

    it( 'has route handler for /get_users', async () => {
        const res = await getUsers();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).not.toBe( PATH_NOT_FOUND_ERROR );
    } );

    it( 'throws AuthenticationFailedError if no / invalid token is present', async () => {
        const res = await getUsers();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).toBe( AUTHENTICATION_FAILED_ERROR );
    } );

    it( 'does not throw AuthenticationFailedError if valid token is found ', async () => {
        const { token } = await global.signup();

        const res = await getUsers( {}, token );

        expect( res.body.errors?.[0].name ).not.toBe( AUTHENTICATION_FAILED_ERROR );
    } );

    it( 'throws RequestValidationError if unwanted data is present in the req body', async () => {
        const { token } = await global.signup();

        const res = await getUsers( { test: "test" }, token );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).toBe( YUP_REQUEST_VALIDATION_ERROR );
    } );

    it( 'gives a list of users if every thing is fine, & password doen not exits on each user', async () => {
        const { token } = await global.signup();

        const res = await getUsers( {}, token );

        expect( res.body.status ).toBe( "success" );
        expect( res.body.data.users ).toHaveLength( 1 );

        // creating new user
        await global.signup( "test2@g.com" );
        const res2 = await getUsers( {}, token );

        const users = res2.body.data.users;

        expect( res2.body.status ).toBe( "success" );
        expect( users ).toHaveLength( 2 );

        // each user info should not have password
        for ( let user of users ) {
            expect( user.password ).toBeUndefined();
        }
    } );

} );

