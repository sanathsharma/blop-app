// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
// models
import User from "models/user/user.model";
import UserStatus from "models/user/userStatus.model";

// common lib
import { NO_UNKNOWN, validate, sendMessage, BadRequestError } from '@ssbdev/common';

// initializations
// validation schema
const deactivateUserReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deactivateUserReqBody ),
    async ( req, res, next ) => {
        const userId = req['userId'];

        try {
            const user = await User.findByPk( userId );

            // if user not found
            if ( !user ) throw new BadRequestError( "User not found", "Something went wrong, could not delete your account" );

            // get status inactive record
            const status = await UserStatus.findOne( {
                where: { name: "inactive" }
            } );

            // deactivate account by seting statisId to inactive status id
            await user.setStatus( status );

            // send success response
            sendMessage( res, "Account Deactivated" );
        } catch ( e ) {
            next( e );
        }
    }];