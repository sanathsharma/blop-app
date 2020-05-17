// express
// vendors
import * as yup from 'yup';

// middlewares
import { checkAuth } from "isAuth";
import validate from "middleware/validate-req-body";

// utils
import { NO_UNKNOWN } from "utils/constants";
import { sendError, sendMessage, sendServerError } from "utils/response";

// models
import User from "models/user/user.model";

// initializations
// validation schema
const updateUserReqBody = yup.object().shape( {
    updates: yup.object().shape( {
        password: yup.string().trim().min( 8 ).notRequired(),
        firstName: yup.string().trim().notRequired(),
        lastName: yup.string().trim().notRequired(),
        bio: yup.string().trim().max( 150 ).notRequired()
    } ).strict( true ).required( "updates object is required" ).noUnknown( true, NO_UNKNOWN )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    checkAuth, validate( updateUserReqBody ),
    async ( req, res, next ) => {
        const allowedUpdates = ['password', 'firstName', 'lastName', 'bio'];
        const userId = req['userId'];
        const { updates } = req['validatedBody'];

        try {
            // find the user
            const user = await User.findByPk( userId, {
                attributes: ['password', 'firstName', 'lastName', 'bio', 'id']
            } );

            // if user not found
            if ( !user ) return sendError( res, "Could not update the user info", "User not found" );

            // update the user
            Object.keys( updates ).forEach( key => {
                if ( allowedUpdates.includes( key ) ) user[key] = updates[key];
            } );

            // save and send the succes response
            if ( user.changed() )
                await user.save();

            // send success respones
            sendMessage( res, "User info updated" );
        } catch ( e ) {
            next( e );
        }
    }]; 