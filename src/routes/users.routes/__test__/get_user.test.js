import request from 'supertest';
import { app } from 'app';
import {
    PATH_NOT_FOUND_ERROR,
    AUTHENTICATION_FAILED_ERROR,
    NOT_FOUND_ERROR,
    REQUEST_VALIDATION_ERROR
} from '@ssbdev/common';

// ----------------------------------------------------------------------------------------------

const getUser = () => request( app ).post( "/api/users/get_user" );

// ----------------------------------------------------------------------------------------------

it( 'has a /get_user route handler', async () => {
    const res = await getUser()
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( PATH_NOT_FOUND_ERROR );
} );

it( 'throws AuthintacationFailedError if token not found', async () => {
    const res = await getUser()
        .send( {} )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( AUTHENTICATION_FAILED_ERROR );
} );

it( 'does not throw AuthenticationFailedError if valid token is found ', async () => {
    const { token } = await global.signup();

    const res = await getUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( AUTHENTICATION_FAILED_ERROR );
} );

it( 'throws NotFoundError if userId in body not in db or inactive', async () => {
    const { token } = await global.signup();

    const res = await getUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( { userId: 200 } )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( NOT_FOUND_ERROR );
} );

it( 'throws RequestValidationError if unwanted data is present in request body', async () => {
    const { token } = await global.signup();

    const res = await getUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( { test: "test" } )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( REQUEST_VALIDATION_ERROR );
} );

it( 'return proper response if valid userId is present in req body & doesnot have password in response', async () => {
    const { token, userId } = await global.signup();

    const res = await getUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( { userId } )
        .expect( 200 );

    expect( res.body.status ).toBe( "success" );
    expect( res.body.data.user.id ).toEqual( userId );

    // password should not exists
    expect( res.body.data.user.password ).toBeUndefined();
} );
