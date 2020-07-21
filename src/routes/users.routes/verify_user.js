// vendors
import * as yup from 'yup';
import * as Sequelize from 'sequelize';

// common
import { NO_UNKNOWN, validate, sendMessage } from "@ssbdev/common";

// utils
import { tokens } from "helpers/generateTokens";

// middlewares
import statusCache from "middleware/statusCache";

// models
import User from "models/user/user.model";

// errors
import { UnauthorizedError } from "errors/unauthorized-error";

// ----------------------------------------------------------------------------
// schema
const verifyUserSchema = {
    body: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    params: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    query: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
};

// ----------------------------------------------------------------------------

export default [
    validate(
        verifyUserSchema.body,
        verifyUserSchema.params,
        verifyUserSchema.query
    ),
    statusCache( "user" ),
    async ( req, res, next ) => {
        const token = req.get( "Authorization" )?.split( " " )?.[1];
        const { USERSTATUS } = req;

        try {
            if ( !token ) throw new UnauthorizedError( "Token missing" );

            const { userId } = tokens.verifyUser.verify( token );

            const user = await User.findOne( {
                where: {
                    id: userId,
                    statusId: {
                        [Sequelize.Op.in]: [
                            USERSTATUS.ACTIVE,
                            USERSTATUS.NOT_VERIFIED
                        ]
                    }
                }
            } );

            if ( !user ) throw new UnauthorizedError( "User not found" );

            // if already verified(i,e active), skip
            // not verified, change the status to active
            if ( user.statusId === USERSTATUS.NOT_VERIFIED ) {
                await user.setStatus( USERSTATUS.ACTIVE );
            }

            // sendResponse
            sendMessage( res, "Your email id is successfully verified..." );

        } catch ( e ) {
            next( e );
        }
    }
];