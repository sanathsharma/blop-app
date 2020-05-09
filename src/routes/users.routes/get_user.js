// express
// vendors
import * as yup from 'yup';

// middlewares
import { checkAuth } from "isAuth";
import validate from "middleware/validate-req-body";

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData, sendServerError } from "utils/response";

// models
import User from "models/user.model";
import UserDp from "models/userDp.model";
import UserStatus from "models/userStatus.model";

// initializations
// validation schema
const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().required( "userId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default () => [
    checkAuth,
    validate( getUserReqBodySchema ),
    async ( req, res, next ) => {
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
    }];