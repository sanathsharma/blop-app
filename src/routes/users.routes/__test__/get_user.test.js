// vendors
import request from 'supertest';

// app
import { app } from 'app';

// common
import {
    AUTHENTICATION_FAILED_ERROR,
} from '@ssbdev/common';

// errors
import { PATH_NOT_FOUND_ERROR } from "errors/path-not-found-error";
import { NOT_FOUND_ERROR } from "errors/not-found-error";
import { REQUEST_VALIDATION_ERROR } from "errors/request-validation-error";

// ----------------------------------------------------------------------------------------------

describe( 'get_user', () => {

    const getUserUrl = "/api/users/get_user";

    const getUser = ( body = {}, token ) =>
        request( app )
            .post( getUserUrl )
            .set( "Authorization", token ? `Bearer ${ token }` : "" )
            .send( body )
            .expect( 200 );

    // -------------------------------------------------------------------------------------------

    it( 'has a /get_user route handler', async () => {
        const res = await getUser();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).not.toBe( PATH_NOT_FOUND_ERROR );
    } );

    it( 'throws AuthintacationFailedError if token not found', async () => {
        const res = await getUser();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).toBe( AUTHENTICATION_FAILED_ERROR );
    } );

    it( 'does not throw AuthenticationFailedError if valid token is found ', async () => {
        const { token } = await global.signup();

        const res = await getUser( {}, token );

        expect( res.body.errors[0].name ).not.toBe( AUTHENTICATION_FAILED_ERROR );
    } );

    it( 'throws NotFoundError if userId in body not in db or inactive', async () => {
        const { token } = await global.signup();

        const res = await getUser( { userId: 200 }, token );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).toBe( NOT_FOUND_ERROR );
    } );

    it( 'throws RequestValidationError if unwanted data is present in request body', async () => {
        const { token } = await global.signup();

        const res = await getUser( { test: "test" }, token );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).toBe( REQUEST_VALIDATION_ERROR );
    } );

    it( 'return proper response if valid userId is present in req body & doesnot have password in response', async () => {
        const { token, userId } = await global.signup();

        const res = await getUser( { userId }, token );

        expect( res.body.status ).toBe( "success" );
        expect( res.body.data.user.id ).toEqual( userId );

        // password should not exists
        expect( res.body.data.user.password ).toBeUndefined();
    } );

} );
