import { compare } from 'bcryptjs';
import express from 'express';
import { checkAuth } from 'isAuth';
import { sign } from 'jsonwebtoken';
import { pick } from 'lodash';
import User from 'models/user.model';
import UserDp from 'models/userDp.model';
import UserStatus from 'models/userStatus.model';
import * as yup from 'yup';
import validate from 'middleware/validate-req-body';

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
        .then( users => {
            res.status( 200 ).json( {
                status: "success",
                data: {
                    users: users.map( user => user.toJSON() )
                }
            } );
        } )
        .catch( e => {
            res.status( 500 ).json( {
                status: "error",
                message: "Server Error",
                error: e
            } );
        } );
} );

// ----------------------------- login --------------------------------

const loginReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( 8, "password should have minimum of 8 characters" ).required( "password is required" )
} ).noUnknown( true );

router.post( '/login', validate( loginReqBodySchema ), ( req, res, next ) => {
    const { emailId, password } = req['validatedBody'];

    User.findOne( {
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
    } )
        .then( user => {
            if ( !user )
                res.status( 200 ).json( {
                    status: "error",
                    message: "Unauthorized",
                    error: {
                        message: "Authentication Failed."
                    }
                } );
            else
                return Promise.all( [compare( password, user.password ), user] );
        } )
        .then( ( [match, user] ) => {
            if ( !match )
                res.status( 401 ).json( {
                    status: "error",
                    message: "Unauthorized",
                    error: {
                        message: "Authentication Failed."
                    }
                } );
            else {
                const token = sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.status( 200 ).json( {
                    status: "success",
                    message: "Logged In.",
                    user: pick( user, ["id", "emailId"] ),
                    token,
                    tokenExpiration: 1
                } );
            }
        } )
        .catch( e => {
            res.status( 200 ).json( {
                status: "error",
                message: "Server Error",
                error: e
            } );
        } );
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
        if ( !status ) return res.status( 200 ).json( {
            status: "error",
            message: "Something went wrong",
            error: {
                message: "Could not create user"
            }
        } );

        // get users with active status to check if the user already exists
        const users = await status.getUsers( {
            where: { emailId }
        } );
        if ( users.length > 0 ) return res.status( 200 ).json( {
            status: "error",
            message: "Conflict",
            error: {
                message: "User Already Exists."
            }
        } );

        // create new user with status active
        const newUser = await status.createUser( { emailId, password, firstName, lastName, bio }, {
            attributes: ['id', "emailId", "firstName", "lastName", "bio", "statusId", "dpId"]
        } );
        res.status( 200 ).json( {
            status: "success",
            data: {
                newUser
            }
        } );
    } catch ( e ) {
        res.status( 200 ).json( {
            status: "error",
            message: "Server Error",
            error: e
        } );
    }

    // yupValidate( signUpReqBodySchema, req.body )
    //     .then( () => {
    //         return User.findOrCreate( {
    //             where: { emailId },
    //             defaults: { // todo: works but check if usage is right?
    //                 emailId,
    //                 password: password.trim(),
    //                 firstName,
    //                 lastName,
    //                 bio
    //             },
    //             include: [
    //                 {
    //                     model: UserStatus,
    //                     attributes: ["name"],
    //                     as: "status"
    //                 },
    //             ]
    //         } );
    //     } )
    //     .then( ( [user, created] ) => {
    //         if ( created )
    //             res.status( 200 ).json( {
    //                 status: "success",
    //                 message: "User Created",
    //                 user: pick( user, ['id', 'email'] )
    //             } );
    //         else
    //             res.status( 200 ).json( {
    //                 status: "error",
    //                 message: "Conflict",
    //                 error: {
    //                     message: "User Already Exists."
    //                 }
    //             } );
    //     } )
    //     .catch( e => {
    //         res.status( 500 ).json( {
    //             status: "error",
    //             message: "Server Error",
    //             error: e,
    //         } );
    //     } );
} );

// -------------------------- get single user -------------------------------

const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().required( "userId is required" )
} ).strict( true ).noUnknown( true );

router.post( "/get_user", checkAuth, validate( getUserReqBodySchema ), ( req, res, next ) => {
    const { userId } = req['validatedBody'];

    User.findByPk( userId, {
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
    } )
        .then( user => {
            if ( !user ) return res.status( 200 ).json( {
                status: "error",
                message: "User not found",
                error: {
                    message: "User not found"
                }
            } );
            res.status( 200 ).json( {
                status: "success",
                data: {
                    user: user.toJSON()
                }
            } );
        } )
        .catch( e => {
            res.status( 200 ).json( {
                status: "error",
                message: "Server Error",
                error: e
            } );
        } );
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

router.patch( "/update_user", checkAuth, validate( updateUserReqBody ), async ( req, res, next ) => {
    const allowedUpdates = ['password', 'firstName', 'lastName', 'bio'];
    const { userId, updates } = req['validatedBody'];

    try {
        // find the user
        const user = await User.findByPk( userId, {
            attributes: ['password', 'firstName', 'lastName', 'bio']
        } );
        if ( !user ) return res.status( 200 ).json( {
            status: "error",
            message: "Could not update the user info",
            error: {
                message: "User not found"
            }
        } );

        // update the user
        Object.keys( updates ).forEach( key => {
            if ( allowedUpdates.includes( key ) ) user[key] = updates[key];
        } );

        // save and send the succes response
        await user.save();
        res.status( 200 ).json( {
            status: "success",
            message: "User info updated"
        } );
    } catch ( e ) {
        res.status( 200 ).json( {
            status: "error",
            message: "Server Error",
            error: e
        } );
    }
} );

// ----------------------------------- delete user -----------------------------------

const deleteUserReqBody = yup.object().shape( {
    userId: yup.number().required( "userId is required" )
} ).strict( true ).noUnknown( true );

router.delete( "/delete_user", checkAuth, validate( deleteUserReqBody ), ( req, res, next ) => {
    const { userId } = req['validatedBody'];

    User
        .destroy( {
            where: { id: userId }
        } )
        .then( rowsDestroyed => {
            res.status( 200 ).json( {
                status: "success",
                message: "User Deleted"
            } );
        } )
        .catch( e => {
            res.status( 500 ).json( {
                status: "error",
                message: "Server Error",
                error: e
            } );
        } );
} );

export default router;