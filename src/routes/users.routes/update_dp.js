// express
// vendors
import * as yup from 'yup';

// middlewares
import { checkAuth } from "isAuth";
import validate from "middleware/validate-req-body";

// utils
import message from "utils/message";
import upload from "./dp_storage.util";
import { NO_UNKNOWN } from "utils/constants";
import { sendData, sendServerError, sendError } from "utils/response";

// models
import User from "models/user.model";
import UserDp from "models/userDp.model";
import UserStatus from "models/userStatus.model";

// initializations
// validation schema
const updateDpReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default () => [
    checkAuth,
    upload.single( 'file' ),
    // for multer to parse formData and place req.body, so that it can be validated
    // for unwanted data except file, which is validated in multer upload function defination
    validate( updateDpReqBody ),
    async ( req, res, next ) => {
        const { file, userId } = req; // appended by multer

        // file missing in form data -> mulre upload did not run -> no file key on req
        if ( !file ) sendError(
            res,
            'File is required',
            'File is required'
        );

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
                    },
                    {
                        model: UserDp,
                        attributes: ['id', 'url'],
                        as: 'dp'
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
            const dp = await user.createDp( {
                url: `user_dp/${ file.filename }`
            } );

            // send url to client
            sendData( res, { dp: dp.url } );

        } catch ( e ) {
            sendServerError( res )( e );
        }
    }
];
