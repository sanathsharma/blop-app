// express
// vendors
import { pick } from "lodash";
import * as yup from 'yup';

// middlewares
// utils
// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";
import UserStatus from "models/user/userStatus.model";

// common lib
import { NO_UNKNOWN, validate, sendData } from "@ssbdev/common";

// initializations
// validation schema
const getUsersReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getUsersReqBody ),
    async ( req, res, next ) => {
        try {
            const users = await User.findAll( {
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
            } );

            sendData( res, {
                users: users.map( user => pick( user.toJSON(), ["id", "emailId", "firstName", "dp"] ) )
            } );
        } catch ( e ) {
            next( e );
        }
    }
]; 