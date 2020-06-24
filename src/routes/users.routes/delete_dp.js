
// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import User from "models/user/user.model";

// common lib
import { NO_UNKNOWN, validate, sendMessage, UnauthorizedError } from '@ssbdev/common';

// initializations
// validation schema
const deleteDpReqBodySchema = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deleteDpReqBodySchema ),
    statusCache(),
    async ( req, res, next ) => {
        const userId = req['userId'];
        const { USERSTATUS } = req;

        try {
            // get the atcive user by id
            const user = await User.findByPk( userId, {
                attributes: ['id'],
                where: { statusId: USERSTATUS.ACTIVE }
            } );

            // if user not found
            if ( !user ) throw new UnauthorizedError( 'User not found' );

            // create new dp
            await user.setDp( null );

            // send url to client
            sendMessage( res, "Deleted" );

        } catch ( e ) {
            next( e );
        }
    }
];