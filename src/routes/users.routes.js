// express
import express from 'express';

// vendors
import * as yup from 'yup';
import { pick } from 'lodash';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// middlewares
import { checkAuth } from 'isAuth';
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { sendData, sendServerError, sendError, sendMessage } from 'utils/response';

// models
import User from 'models/user.model';
import UserDp from 'models/userDp.model';
import UserStatus from 'models/userStatus.model';

// initializations
const router = express.Router();

// -------------------------- get all active users -------------------------

router.post( '/get_users', checkAuth, ( req, res, next ) => {
    User
        .findAll( {
            where: { "$status.name$": "active" },
            attributes: ["id", "emailId"],
            include: [
                {
                    model: UserStatus,
                    attributes: ["name"],
                    as: "status"
                },
                {
                    model: UserDp,
                    attributes: ["url", "createdAt"],
                    as: "dp"
                }
            ]
        } )
        .then( users => sendData( res, { users: users.map( user => user.toJSON() ) } ) )
        .catch( sendServerError( res ) );
} );

// ----------------------------- login --------------------------------

const loginReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( 8, "password should have minimum of 8 characters" ).required( "password is required" )
} ).noUnknown( true );

router.post( '/login', validate( loginReqBodySchema ), async ( req, res, next ) => {
    const { emailId, password } = req['validatedBody'];

    try {
        const user = await User.findOne( {
            where: { emailId, '$status.name$': "active" },
            include: [
                {
                    model: UserStatus,
                    attributes: ["name"],
                    as: "status"
                },
                {
                    model: UserDp,
                    attributes: ["url", "createdAt"],
                    as: "dp"
                }
            ]
        } );

        // if user not found
        if ( !user ) return sendError( res, 'Unauthorized', 'Authentication Failed' );

        // check password match
        const match = await compare( password, user.password );

        // if password did not match
        if ( !match ) return sendError( res, 'Unauthorized', 'Authentication Failed' );

        // create token and send response on password match
        const token = sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        sendData( res, {
            user: pick( user, ["id", "emailId"] ),
            token,
            tokenExpiration: 1
        }, "Logged In" );

    } catch ( e ) {
        sendServerError( res )( e );
    }
} );

// ------------------------------------- sign up / create user -------------------------

const signUpReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( 8, "password should have atleast 8 characters" ).required( "password is required" ),
    firstName: yup.string().trim().strict( true ).min( 3 ).required( "firstName is required" ),
    lastName: yup.string().trim().strict( true ).notRequired(),
    bio: yup.string().trim().max( 150 ).notRequired()
} ).strict( true ).noUnknown( true );

router.post( '/signup', validate( signUpReqBodySchema ), async ( req, res, next ) => {
    const { emailId, password, firstName, lastName, bio } = req['validatedBody'];

    try {
        // get status active record
        const status = await UserStatus.findOne( {
            where: { name: "active" }
        } );

        // if active status not found in db
        if ( !status ) return sendError( res,
            message( "Something went wrong", "\"active\" status not found in database" ),
            "Could not signup"
        );

        // get users with active status to check if the user already exists
        const users = await status.getUsers( {
            where: { emailId }
        } );

        // send error if user with same email exists
        if ( users.length > 0 ) return sendError( res,
            message( "Could not sign you up", "Conflict" ),
            message( "Something went wrong", "User already exists" )
        );

        // create new user with status active
        const newUser = await status.createUser( { emailId, password, firstName, lastName, bio }, {
            attributes: ['id', "emailId", "firstName", "lastName", "bio", "statusId", "dpId"]
        } );

        sendData( res, { newUser } );

    } catch ( e ) {
        sendServerError( res )( e );
    }
} );

// -------------------------- get single user -------------------------------

const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().required( "userId is required" )
} ).strict( true ).noUnknown( true );

router.post( "/get_user", checkAuth, validate( getUserReqBodySchema ), async ( req, res, next ) => {
    const { userId } = req['validatedBody'];

    try {
        const user = await User.findByPk( userId, {
            include: [
                {
                    model: UserStatus,
                    attributes: ['name'],
                    as: "status"
                },
                {
                    model: UserDp,
                    attributes: ['url'],
                    as: "dp"
                }
            ]
        } );

        // if user not found
        if ( !user ) return sendError( res, "User not found", "User not found" );

        sendData( res, { user: user.toJSON() } );
    } catch ( e ) {
        sendServerError( res )( e );
    }
} );

// -------------------------------------- update user --------------------------------

const updateUserReqBody = yup.object().shape( {
    userId: yup.number().required( "userId is required" ),
    updates: yup.object().shape( {
        password: yup.string().trim().min( 8 ).notRequired(),
        firstName: yup.string().trim().notRequired(),
        lastName: yup.string().trim().notRequired(),
        bio: yup.string().trim().max( 150 ).notRequired()
    } ).strict( true ).required( "updates object is required" ).noUnknown( true, "Unauthorized" )
} ).strict( true ).noUnknown( true, "Unauthorized" );

router.post( "/update_user", checkAuth, validate( updateUserReqBody ), async ( req, res, next ) => {
    const allowedUpdates = ['password', 'firstName', 'lastName', 'bio'];
    const { userId, updates } = req['validatedBody'];

    try {
        // find the user
        const user = await User.findByPk( userId, {
            attributes: ['password', 'firstName', 'lastName', 'bio']
        } );

        // if user not found
        if ( !user ) return sendError( res, "Could not update the user info", "User not found" );

        // update the user
        Object.keys( updates ).forEach( key => {
            if ( allowedUpdates.includes( key ) ) user[key] = updates[key];
        } );

        // save and send the succes response
        await user.save();
        sendMessage( res, "User info updated" );
    } catch ( e ) {
        sendServerError( res )( e );
    }
} );

// ----------------------------------- delete user -----------------------------------

const deleteUserReqBody = yup.object().shape( {
    userId: yup.number().required( "userId is required" )
} ).strict( true ).noUnknown( true );

router.post( "/delete_user", checkAuth, validate( deleteUserReqBody ), ( req, res, next ) => {
    const { userId } = req['validatedBody'];

    User
        .destroy( {
            where: { id: userId }
        } )
        .then( rowsDestroyed => sendMessage( res, "User Deleted" ) )
        .catch( sendServerError( res ) );
} );

export default router;