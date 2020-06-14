// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
import uploadUserDp from "./dp_storage.util";

// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";
import UserStatus from "models/user/userStatus.model";

// common lib
import { NO_UNKNOWN, validate, sendData, RequestValidationError, UnauthorizedError } from '@ssbdev/common';

// initializations
// validation schema
const updateDpReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    uploadUserDp.single( 'file' ),
    // for multer to parse formData and place req.body, so that it can be validated
    // for unwanted data except file, which is validated in multer upload function defination
    validate( updateDpReqBody ),
    async ( req, res, next ) => {
        const { file, userId } = req; // appended by multer

        try {
            // file missing in form data -> multer upload did not run -> no file key on req
            if ( !file ) throw new RequestValidationError( 'File is required' );

            // get the atcive user by id
            const user = await User.findByPk( userId, {
                attributes: ['id'],
                where: { '$status.name$': 'active' },
                include: [
                    {
                        model: UserStatus,
                        attributes: ['name', 'id'],
                        as: 'status'
                    },
                    {
                        model: UserDp,
                        attributes: ['id', 'url'],
                        as: 'dp'
                    }
                ]
            } );

            // if user not found
            if ( !user ) throw new UnauthorizedError( 'User not found' );

            // create new dp
            const dp = await user.createDp( {
                url: `user_dp/${ file.filename }`
            } );

            // send url to client
            sendData( res, { dp: dp.url } );

        } catch ( e ) {
            next( e );
        }
    }
];
