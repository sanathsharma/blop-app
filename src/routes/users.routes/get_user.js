// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";

// common lib
import { NO_UNKNOWN, validate, sendData, NotFoundError, exclude } from '@ssbdev/common';

// initializations
// validation schema
const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().positive().integer().required( "userId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// TODO: send posts also
export default [
    validate( getUserReqBodySchema ),
    statusCache(),
    async ( req, res, next ) => {
        const { userId } = req.validated.body;
        const { USERSTATUS } = req;

        try {
            const user = await User.findOne( {
                where: {
                    id: userId,
                    statusId: USERSTATUS.ACTIVE
                },
                attributes: {
                    exclude: ['dpId', 'password']
                },
                include: [
                    {
                        model: UserDp,
                        attributes: ['url'],
                        as: "dp"
                    }
                ]
            } );

            // if user not found
            if ( !user ) throw new NotFoundError( "User not found" );

            sendData( res, { user: exclude( user.toJSON(), ["statusId"] ) } );

        } catch ( e ) {
            next( e );
        }
    }];