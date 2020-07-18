// vendors
import request from 'supertest';

// app
import { app } from "app";

// common
import { } from "@ssbdev/common";
import { PATH_NOT_FOUND_ERROR } from "errors/path-not-found-error";

// errors

// -------------------------------------------------------------------------------

describe( 'signup', () => {
    const url = "/api/users/signup";

    const signup = ( body, token ) => request( app )
        .post( url )
        .set( "Authorization", `Bearer ${ token }` )
        .send( body )
        .expect( 200 );

    it( 'has a route handler', async () => {
        const res = await signup();

        expect( res.body.status ).toBe( "error" );
        expect( res.body.errors[0].name ).not.toBe( PATH_NOT_FOUND_ERROR );
    } );

} );

// -------------------------------------------------------------------------------

