// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from "middleware/validate-req-body";

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendServerError } from "utils/response";

// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";
import UserStatus from "models/user/userStatus.model";

// initializations
// validation schema
const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().positive().integer().required( "userId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getUserReqBodySchema ),
    async ( req, res, next ) => {
        const { userId } = req['validatedBody'];

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
            if ( !user ) return sendError( res, "User not found", "User not found" );

            sendData( res, { user: user.toJSON() } );
        } catch ( e ) {
            next( e );
        }
    }];