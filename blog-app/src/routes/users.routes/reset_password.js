// vendors
import * as yup from 'yup';
import { Op } from "sequelize";

// common
import { NO_UNKNOWN, validate, sendMessage } from "@ssbdev/common";

// models
import User from "models/user/user.model";

// constants
import {
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH_MSG,
    TOKEN_EXPIRED_ERROR_NAME
} from "constants/app.constants";

// utils
import { tokens } from "helpers/generateTokens";

// errors
import { UnauthorizedError } from "errors/unauthorized-error";

// middleware
import statusCache from "middleware/statusCache";

// schema
const resetPasswordSchema = {
    body: yup.object().shape( {
        password: yup.string().trim().min( PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MSG ).max( PASSWORD_MAX_LENGTH ).required()
    } ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    params: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    query: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
};

// ------------------------------------------------------------------------------------

export default [
    validate(
        resetPasswordSchema.body,
        resetPasswordSchema.params,
        resetPasswordSchema.query,
    ),
    statusCache( "user" ),
    async ( req, res, next ) => {
        const token = req.get( "Authorization" )?.split( " " )?.[1];
        const { password } = req.validated.body;
        const { USERSTATUS } = req;

        try {
            if ( !token ) throw new Error( "Token Missing" );

            const { userId } = tokens.resetPassword.verify( token );

            // get user instance
            const user = await User.findOne( {
                where: {
                    id: userId,
                    statusId: {
                        [Op.in]: [
                            USERSTATUS.ACTIVE,
                            USERSTATUS.NOT_VERIFIED
                        ]
                    }
                }
            } );

            if ( !user ) throw new Error( "User not found" );

            // change user password
            user.password = password;

            // save changes
            await user.save();

            // send response
            sendMessage( res, "Password reset successful." );

        } catch ( e ) {
            if ( e.name === TOKEN_EXPIRED_ERROR_NAME ) return sendMessage( res, "URL expired..." );

            next( new UnauthorizedError( e.message ) );
        }
    }
];
