// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
// common lib
import { NO_UNKNOWN, validate, sendData, BadRequestError } from '@ssbdev/common';
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

// initializations
// validation schema
const signUpReqBodySchema = yup.object().shape( {
    emailId: yup.string().trim().email().required( "emailId is required" ),
    password: yup.string().trim().min( 8, "password should have atleast 8 characters" ).required( "password is required" ),
    firstName: yup.string().trim().strict( true ).min( 3 ).required( "firstName is required" ),
    lastName: yup.string().trim().strict( true ).notRequired(),
    bio: yup.string().trim().max( 150 ).notRequired()
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
                statusId: USERSTATUS.ACTIVE
            }, {
                attributes: ['id', "emailId", "firstName", "lastName", "bio"],
                include: [{
                    model: UserDp,
                    attributes: ["url"],
                    as: "dp"
                }]
            } );

            // todo: send verification link
            sendData( res, { newUser: newUser.get() } );

        } catch ( e ) {
            next( e );
        }
    }]; 