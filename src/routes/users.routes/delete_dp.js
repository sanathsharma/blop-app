
// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
// models
import User from "models/user/user.model";
import UserStatus from "models/user/userStatus.model";

// common lib
import { NO_UNKNOWN, validate, sendMessage, UnauthorizedError } from '@ssbdev/common';

// initializations
// validation schema
const deleteDpReqBodySchema = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
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