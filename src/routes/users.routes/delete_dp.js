
// express
// vendors
import * as yup from 'yup';

// middlewares
import { checkAuth } from "isAuth";
import validate from "middleware/validate-req-body";

// utils
import message from "utils/message";
import { NO_UNKNOWN } from "utils/constants";
import { sendError, sendServerError, sendMessage } from "utils/response";

// models
import User from "models/user.model";
import UserStatus from "models/userStatus.model";

// initializations
// validation schema
const deleteDpReqBodySchema = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    checkAuth,
    validate( deleteDpReqBodySchema ),
    async ( req, res, next ) => {
        const userId = req['userId'];

        try {
            // get the atcive user by id
            const user = await User.findByPk( userId, {
                attributes: ['id'],
                where: { '$status.name$': 'active' },
                include: [
                    {
                        model: UserStatus,
                        attributes: ['name', 'id'],
                        as: 'status'
                    }
                ]
            } );

            // if user not found
            if ( !user ) return sendError(
                res,
                message( 'Unauthorized', 'User not found' ),
                'Unauthorized'
            );

            // create new dp
            await user.setDp( null );

            // send url to client
            sendMessage( res, "Deleted" );

        } catch ( e ) {
            sendServerError( res )( e );
        }
    }
];