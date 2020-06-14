// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";
import UserStatus from "models/user/userStatus.model";

// common lib
import { NO_UNKNOWN, validate, sendData, NotFoundError } from '@ssbdev/common';

// initializations
// validation schema
const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().positive().integer().required( "userId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// TODO: send posts also
export default [
    validate( getUserReqBodySchema ),
    async ( req, res, next ) => {
        const { userId } = req.validated.body;

        try {
            const user = await User.findByPk( userId, {
                attributes: {
                    exclude: ['dpId', 'statusId', 'password']
                },
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
            if ( !user ) throw new NotFoundError( "User not found" );

            sendData( res, { user: user.toJSON() } );
        } catch ( e ) {
            next( e );
        }
    }];