// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import User from "models/user/user.model";

// common lib
import { NO_UNKNOWN, validate, sendMessage } from '@ssbdev/common';

// errors
import { BadRequestError } from "errors/bad-request-error";

// initializations
// validation schema
const deactivateUserReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export const USER_ACCOUNT_DEACTIVETED_MSG = "Account Deactivated";

export default [
    validate( deactivateUserReqBody ),
    statusCache(),
    async ( req, res, next ) => {
        const { USERSTATUS } = req;
        const { userId } = req.auth;

        try {
            const user = await User.findByPk( userId );

            // if user not found
            if ( !user ) throw new BadRequestError( "User not found", "Something went wrong, could not delete your account" );

            // deactivate account by seting statisId to inactive status id
            await user.setStatus( USERSTATUS.INACTIVE );

            // send success response
            sendMessage( res, USER_ACCOUNT_DEACTIVETED_MSG );

        } catch ( e ) {
            next( e );
        }
    }];