// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import User from "models/user/user.model";

// commonn lib
import { NO_UNKNOWN, validate, sendMessage } from '@ssbdev/common';

// errors
import { UnauthorizedError } from "errors/unauthorized-error";

// constants
import {
    PASSWORD_MIN_LENGTH,
    USER_BIO_MAX_LENGTH,
    USER_FIRSTNAME_MIN_LENGTH
} from "constants/app.constants";

// initializations
// validation schema
const updateUserReqBody = yup.object().shape( {
    updates: yup.object().shape( {
        password: yup.string().trim().min( PASSWORD_MIN_LENGTH ).notRequired(),
        firstName: yup.string().trim().min( USER_FIRSTNAME_MIN_LENGTH ).notRequired(),
        lastName: yup.string().trim().notRequired(),
        bio: yup.string().trim().max( USER_BIO_MAX_LENGTH ).notRequired()
    } ).strict( true ).required( "updates object is required" ).noUnknown( true, NO_UNKNOWN )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( updateUserReqBody ),
    statusCache(),
    async ( req, res, next ) => {
        const allowedUpdates = ['password', 'firstName', 'lastName', 'bio'];
        const { updates } = req.validated.body;
        const { USERSTATUS } = req;
        const { userId } = req.auth;

        try {
            // find the user
            const user = await User.findOne( {
                where: { id: userId, statusId: USERSTATUS.ACTIVE },
                attributes: ['password', 'firstName', 'lastName', 'bio', 'id']
            } );

            // if user not found
            if ( !user ) throw new UnauthorizedError( "User not found" );

            // update the user
            for ( let key in updates ) {
                if ( allowedUpdates.includes( key ) ) user[key] = updates[key];
            }

            // save and send the succes response
            if ( user.changed() )
                await user.save();

            // send success respones
            sendMessage( res, "User info updated" );

        } catch ( e ) {
            next( e );
        }
    }
]; 