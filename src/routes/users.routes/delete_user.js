// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from "middleware/validate-req-body";

// utils
import { NO_UNKNOWN } from "utils/constants";
import { sendMessage, sendServerError } from "utils/response";

// models
import User from "models/user/user.model";

// initializations
// validation schema
const deleteUserReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deleteUserReqBody ),
    ( req, res, next ) => {
        const userId = req['userId'];

        User
            .destroy( {
                where: { id: userId }
            } )
            .then( rowsDestroyed => sendMessage( res, "User Deleted" ) )
            .catch( sendServerError( res ) );
    }]; 