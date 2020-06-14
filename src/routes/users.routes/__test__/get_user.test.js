import request from 'supertest';
import { app } from 'app';
import { PATH_NOT_FOUND_ERROR } from '@ssbdev/common';

it( 'has a /get_user route handler', async () => {
    const res = await request( app )
        .post( "/api/users/get_user" )
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( PATH_NOT_FOUND_ERROR );
} );
