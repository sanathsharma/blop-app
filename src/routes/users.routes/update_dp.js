// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
import uploadUserDp from "./dp_storage.util";

// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// errors
import { UnauthorizedError } from "errors/unauthorized-error";
import { RequestValidationError } from "errors/request-validation-error";

// initializations
// validation schema
const updateDpReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    uploadUserDp.single( 'file' ),
    // for multer to parse formData and place req.body, so that it can be validated
    // for unwanted data except file, which is validated in multer upload function defination
    validate( updateDpReqBody ),
    statusCache(),
    async ( req, res, next ) => {
        const { file, USERSTATUS } = req;
        const { userId } = req.auth;

        try {
            // file missing in form data -> multer upload did not run -> no file key on req
            if ( !file ) throw new RequestValidationError( 'File is required' );

            // get the atcive user by id
            const user = await User.findByPk( userId, {
                attributes: ['id'],
                where: { statusId: USERSTATUS.ACTIVE },
                include: [
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
            let newDp;
            if ( user.dp )
                user.dp.url = `user_dp/${ file.filename }`;
            else
                newDp = await user.createDp( {
                    url: `user_dp/${ file.filename }`
                } );

            if ( user.dp && user.dp.changed() ) await user.save();

            // send url to client
            sendData( res, { dp: newDp?.url ?? user.dp.url ?? null } );

        } catch ( e ) {
            next( e );
        }
    }
];
