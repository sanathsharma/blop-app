// express
// vendors
import { pick } from "lodash";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as yup from 'yup';

// middlewares
import statusCache from "middleware/statusCache";

// utils
// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";

// common lib
import { NO_UNKNOWN, validate, sendData, UnauthorizedError } from "@ssbdev/common";

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

            // create token and send response on password match
            const token = sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            sendData( res, {
                user: pick( user, ["id", "emailId", "firstName", "lastName", "dp"] ),
                token,
                tokenExpiration: 1
            }, "Logged In" );

        } catch ( e ) {
            next( e );
        }
    }
];