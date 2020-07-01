import request from 'supertest';
import { app } from 'app';
import {
    PATH_NOT_FOUND_ERROR,
    YUP_REQUEST_VALIDATION_ERROR,
    UNAUTHORIZED_ERROR
} from '@ssbdev/common';

// --------------------------------------------------------------------------------------------

describe( 'login', () => {

    const loginUrl = "/api/users/login";

    const login = ( body = {} ) =>
        request( app )
            .post( loginUrl )
            .send( body )
            .expect( 200 );

    // -----------------------------------------------------------------------------------------

    it( 'has a route handler', async () => {
        const res = await login();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors?.[0].name ).not.toBe( PATH_NOT_FOUND_ERROR );
    } );

    it( 'returns RequestValidationError if request body is empty', async () => {
        const res = await login();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors?.[0].name ).toBe( YUP_REQUEST_VALIDATION_ERROR );
    } );

    it( 'returns RequestValidationError if incorrect emailId is provided', async () => {
        const res = await login( {
            emailId: "test",
            password: "password"
        } );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors ).toHaveLength( 1 );
        expect( res.body.errors[0].name ).toBe( YUP_REQUEST_VALIDATION_ERROR );
        expect( res.body.errors[0].field ).toBe( "emailId" );
    } );

    it( 'returns RequestValidationError if incorrect password is provided', async () => {
        const res = await login( {
            emailId: "test@g.com",
            password: "passwor"
        } );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors ).toHaveLength( 1 );
        expect( res.body.errors[0].name ).toBe( YUP_REQUEST_VALIDATION_ERROR );
        expect( res.body.errors[0].field ).toBe( "password" );
    } );

    it( 'returns RequestValidationError if unwanted data is present in request body', async () => {
        const res = await login( {
            emailId: "test@g.com",
            password: "password",
            test: ""
        } );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors ).toHaveLength( 1 );
        expect( res.body.errors[0].name ).toBe( YUP_REQUEST_VALIDATION_ERROR );
        expect( res.body.errors[0].field ).toBe( "undefined" );
    } );

    it( 'returns UnauthorizedError if user doesnit exists', async () => {
        const res = await login( {
            emailId: "test@g.com",
            password: "password"
        } );

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors ).toHaveLength( 1 );
        expect( res.body.errors[0].name ).toBe( UNAUTHORIZED_ERROR );
    } );

    it( 'returns userInfo with token on successful login & userInfo doesnot contain password', async () => {
        const { emailId, password } = await global.signup();

        const res = await login( {
            emailId,
            password
        } );

        expect( res.body.status ).toBe( "success" );
        expect( res.body.data.user.password ).toBeUndefined();
        expect( res.body.data.token ).toBeDefined();
    } );

} );



