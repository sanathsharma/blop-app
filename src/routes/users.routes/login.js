// express
// vendors
import { pick } from "lodash";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as yup from 'yup';

// middlewares
import validate from "middleware/validate-req-body";

// utils
import message from "utils/message";
import { NO_UNKNOWN } from "utils/constants";
import { sendError, sendData, sendServerError } from "utils/response";

// models
import User from "models/user.model";
import UserDp from "models/userDp.model";
import UserStatus from "models/userStatus.model";

// initializations
// validation schema
const loginReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( 8, "password should have minimum of 8 characters" ).required( "password is required" )
} ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( loginReqBodySchema ),
    async ( req, res, next ) => {
        const { emailId, password } = req['validatedBody'];

        try {
            const user = await User.findOne( {
                where: { emailId, '$status.name$': "active" },
                include: [
                    {
                        model: UserStatus,
                        attributes: ["name"],
                        as: "status"
                    },
                    {
                        model: UserDp,
                        attributes: ["url", "createdAt"],
                        as: "dp"
                    }
                ]
            } );

            // if user not found
            if ( !user ) return sendError( res,
                message( 'Unauthorized', 'User not found' ),
                'Authentication Failed'
            );

            // check password match
            const match = await compare( password, user.password );

            // if password did not match
            if ( !match ) return sendError( res,
                message( 'Unauthorized', 'Wrong password' ),
                'Authentication Failed'
            );

            // create token and send response on password match
            const token = sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            sendData( res, {
                user: pick( user, ["id", "emailId"] ),
                token,
                tokenExpiration: 1
            }, "Logged In" );

        } catch ( e ) {
            sendServerError( res )( e );
        }
    }
];