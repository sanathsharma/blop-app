// express
// vendors
import { pick } from "lodash";
import { compare } from "bcryptjs";
import * as yup from 'yup';

// middlewares
import statusCache from "middleware/statusCache";

// utils
// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";

// common lib
import {
    NO_UNKNOWN,
    validate,
    sendData
} from "@ssbdev/common";
import { tokens } from "helpers/generateTokens";

// errors
import { UnauthorizedError } from "errors/unauthorized-error";

// initializations
// validation schema
const loginReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( 8, "password should have minimum of 8 characters" ).required( "password is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( loginReqBodySchema ),
    statusCache(),
    async ( req, res, next ) => {
        const { emailId, password } = req.validated.body;
        const { USERSTATUS } = req;

        try {
            const user = await User.findOne( {
                where: { emailId, statusId: USERSTATUS.ACTIVE },
                include: [
                    {
                        model: UserDp,
                        attributes: ["url"],
                        as: "dp"
                    }
                ]
            } );

            // if user not found
            if ( !user ) throw new UnauthorizedError( 'User not found' );

            // check password match
            const match = await compare( password, user.password );

            // if password did not match
            if ( !match ) throw new UnauthorizedError( 'Wrong password' );

            // set payload
            // store same info as accessToken in refreshToken, so when accessToken is lost on page refresh
            // new accessToken can be generated with refresh tokens payload
            const payload = { userId: user.id };

            // create token and send response on password match
            const token = tokens.access.generate( payload );
            const refreshToken = tokens.refresh.generate( payload );

            req.session = { refresh: refreshToken };

            sendData( res, {
                user: pick( user, ["id", "emailId", "firstName", "lastName", "dp"] ),
                token
            }, "Logged In" );

        } catch ( e ) {
            next( e );
        }
    }
];