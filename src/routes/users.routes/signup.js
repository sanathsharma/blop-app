// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from "middleware/validate-req-body";

// utils
import message from "utils/message";
import { NO_UNKNOWN } from "utils/constants";
import { sendError, sendData, sendServerError } from "utils/response";

// models
import UserStatus from "models/user/userStatus.model";

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
    async ( req, res, next ) => {
        const { emailId, password, firstName, lastName, bio } = req['validatedBody'];

        try {
            // get status active record
            const status = await UserStatus.findOne( {
                where: { name: "active" }
            } );

            // if active status not found in db
            if ( !status ) return sendError( res,
                message( "Something went wrong", "\"active\" status not found in database" ),
                "Could not signup"
            );

            // get users with active status to check if the user already exists
            const users = await status.getUsers( {
                where: { emailId }
            } );

            // send error if user with same email exists
            if ( users.length > 0 ) return sendError( res,
                message( "Could not sign you up", "Conflict" ),
                message( "Something went wrong", "User already exists" )
            );

            // create new user with status active
            const newUser = await status.createUser( { emailId, password, firstName, lastName, bio }, {
                attributes: ['id', "emailId", "firstName", "lastName", "bio", "statusId", "dpId"]
            } );

            // todo: send verification link
            sendData( res, { newUser: newUser.get() } );

        } catch ( e ) {
            next( e );
        }
    }]; 