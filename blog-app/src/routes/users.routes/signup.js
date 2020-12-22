// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
import { tokens } from "helpers/generateTokens";

// models
import UserDp from 'models/user/userDp.model';
import User from 'models/user/user.model';

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// errors
import { BadRequestError } from "errors/bad-request-error";

// constants
import {
    PASSWORD_MIN_LENGTH,
    USER_BIO_MAX_LENGTH,
    USER_FIRSTNAME_MIN_LENGTH,
    PASSWORD_MIN_LENGTH_MSG,
    VERIFY_USER_CLIENT_URL
} from "constants/app.constants";

//mailer
import { transporter } from "mailer";


// initializations
// validation schema
const signUpReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MSG ).required( "password is required" ),
    firstName: yup.string().trim().strict( true ).min( USER_FIRSTNAME_MIN_LENGTH ).required( "firstName is required" ),
    lastName: yup.string().trim().strict( true ).notRequired(),
    bio: yup.string().trim().max( USER_BIO_MAX_LENGTH ).notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( signUpReqBodySchema ),
    statusCache(),
    async ( req, res, next ) => {
        const { emailId, password, firstName, lastName, bio } = req.validated.body;
        const { USERSTATUS } = req;

        try {
            // get users with active status to check if the user already exists
            const users = await User.findAll( {
                where: {
                    emailId,
                    statusId: USERSTATUS.ACTIVE
                }
            } );

            // send error if user with same email exists
            if ( users.length > 0 ) throw new BadRequestError( "User already exists", "Could not signup" );

            // create new user with status active
            const newUser = await User.create( {
                emailId,
                password,
                firstName,
                lastName,
                bio,
                statusId: USERSTATUS.NOT_VERIFIED
            }, {
                attributes: ['id', "emailId", "firstName", "lastName", "bio"],
                include: [{
                    model: UserDp,
                    attributes: ["url"],
                    as: "dp"
                }]
            } );

            const token = tokens.verifyUser.generate( { userId: newUser.id } );

            const URL = `${ VERIFY_USER_CLIENT_URL }/${ token }`;

            // send verification link
            transporter.sendMail( {
                from: process.env.NOREPLY_EMAIL,
                to: emailId,
                subject: "Email Verification",
                html: `
                    <p>
                        <a href="${URL}">Click here</a>
                        to verify your email
                    </p>
                `
            }, ( e, info ) => {
                // if no callback is provided, a promise is return
                // a callback is used to send success response even if error exists
                sendData( res, { newUser: newUser.get() } );
            } );

        } catch ( e ) {
            next( e );
        }
    }
]; 