import request from 'supertest';
import { app } from 'app';
import {
    PATH_NOT_FOUND_ERROR,
    AUTHENTICATION_FAILED_ERROR,
    YUP_REQUEST_VALIDATION_ERROR,
    BAD_REQUEST_ERROR
} from '@ssbdev/common';
import { USER_ACCOUNT_DEACTIVETED_MSG } from '../deactivate_user';
import User from 'models/user/user.model';
import UserStatus from 'models/user/userStatus.model';

// ----------------------------------------------------------------------------------------------

const deactivateUser = () => request( app ).post( "/api/users/delete_user" );

// ----------------------------------------------------------------------------------------------

it( 'has route handler for /delete_user', async () => {
    const res = await deactivateUser()
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( PATH_NOT_FOUND_ERROR );
} );

it( 'throws AuthenticationFailedError if no / invalid token is found ', async () => {
    const res = await deactivateUser()
        .send( {} )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( AUTHENTICATION_FAILED_ERROR );
} );

it( 'does not throw AuthenticationFailedError if valid token is found ', async () => {
    const { token } = await global.signup();

    const res = await deactivateUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    expect( res.body.message ).not.toBe( AUTHENTICATION_FAILED_ERROR );
} );

it( 'throws RequestValidationError if unwanted data is present in the req body', async () => {
    const { token } = await global.signup();

    const res = await deactivateUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {
            test: "test"
        } )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( YUP_REQUEST_VALIDATION_ERROR );
} );

it( 'throws BadRequestError if user not found', async () => {
    const token = global.generateToken( 200, "test@example.com" );

    const res = await deactivateUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    expect( res.body.status ).toBe( "error" );
    expect( res.body.message ).toBe( BAD_REQUEST_ERROR );
} );

it( 'returns ok if user got deactiveted', async () => {
    const { token, emailId } = await global.signup();

    const res = await deactivateUser()
        .set( "Authorization", `Bearer ${ token }` )
        .send( {} )
        .expect( 200 );

    // check res body
    expect( res.body.status ).toBe( "success" );
    expect( res.body.message ).toBe( USER_ACCOUNT_DEACTIVETED_MSG );

    // check db
    const user = await User.findOne( {
        where: { emailId },
        include: [{
            model: UserStatus,
            attributes: ["name"],
            as: "status"
        }]
    } );

    expect( user?.status?.name ).toBe( "inactive" );
} );

