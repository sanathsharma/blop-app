// express
// vendors
import * as yup from 'yup';
import { clone } from "lodash";

// middlewares
import statusCache from 'middleware/statusCache';

// utils
import { uploadUserDp, resizeImage } from "./dp_storage.util";

// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// helpers
import { deleteMediaFile } from "helpers/deleteMediaFile";

// errors
import { UnauthorizedError } from "errors/unauthorized-error";
import { RequestValidationError } from "errors/request-validation-error";

// initializations
// validation schema
const updateDpReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    uploadUserDp.single( 'file' ),
    resizeImage,
    // for multer to parse formData and place req.body, so that it can be validated
    // for unwanted data except file, which is validated in multer upload function defination
    validate( updateDpReqBody ),
    statusCache(),
    async ( req, res, next ) => {
        const { file, USERSTATUS } = req;
        const { userId } = req.auth;
        const { images } = req.validated;

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
            if ( user.dp ) {
                const prev = clone( user.dp.url );
                user.dp.url = {
                    "original": `/user_dp/${ file.filename }`,
                    "96x96": `/user_dp/${ images['96x96'] }`,
                    "150x150": `/user_dp/${ images['150x150'] }`,
                };

                // save new urls
                await user.dp.save();

                // delete pervious images
                for ( let key in prev ) {
                    await deleteMediaFile( prev[key] );
                }
            }
            else
                newDp = await user.createDp( {
                    url: {
                        "original": `/user_dp${ file.filename }`,
                        "96x96": `/user_dp${ images['96x96'] }`,
                        "150x150": `/user_dp${ images['150x150'] }`,
                    }
                } );

            // send url to client
            sendData( res, { dpUrl: newDp?.url ?? user.dp.url ?? null } );

        } catch ( e ) {
            next( e );
        }
    }
];
