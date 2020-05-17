// express
// vendors
import * as yup from 'yup';

// middlewares
import { checkAuth } from "isAuth";
import validate from "middleware/validate-req-body";

// utils
import message from "utils/message";
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendMessage, sendServerError } from "utils/response";

// models
import User from "models/user/user.model";
import UserStatus from "models/user/userStatus.model";

// initializations
// validation schema
const deactivateUserReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    checkAuth,
    validate( deactivateUserReqBody ),
    async ( req, res, next ) => {
        const userId = req['userId'];

        try {
            const user = await User.findByPk( userId );

            // if user not found
            if ( !user ) return sendError( res,
                message( "Something went wrong", "User not found" ),
                message( "Could not deactivate your account", "User not found" )
            );

            // get status inactive record
            const status = await UserStatus.findOne( {
                where: { name: "inactive" }
            } );

            // deactivate account by seting statisId to inactive status id
            user.setStatus( status );

            // send success response
            sendMessage( res, "Account Deactivated" );
        } catch ( e ) {
            next( e );
        }
    }];