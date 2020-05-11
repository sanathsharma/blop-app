// express
// vendors
import { pick } from "lodash";
import * as yup from 'yup';

// middlewares
import { checkAuth } from "isAuth";
import validate from "middleware/validate-req-body";

// utils
import { NO_UNKNOWN } from "utils/constants";
import { sendData, sendServerError } from "utils/response";

// models
import User from "models/user.model";
import UserDp from "models/userDp.model";
import UserStatus from "models/userStatus.model";

// initializations
// validation schema
const getUsersReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    checkAuth,
    validate( getUsersReqBody ),
    ( req, res, next ) => {
        User
            .findAll( {
                where: { "$status.name$": "active" },
                attributes: ["id", "emailId", "firstName"],
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
            } )
            .then( users => sendData( res, {
                users: users.map( user => pick( user.toJSON(), ["id", "emailId", "firstName", "dp"] ) )
            } ) )
            .catch( sendServerError( res ) );
    }
]; 