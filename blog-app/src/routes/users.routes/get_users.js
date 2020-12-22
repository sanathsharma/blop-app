// express
// vendors
import { pick } from "lodash";
import * as yup from 'yup';

// middlewares
import statusCache from "middleware/statusCache";

// utils
// models
import User from "models/user/user.model";
import UserDp from "models/user/userDp.model";

// common lib
import { NO_UNKNOWN, validate, sendData } from "@ssbdev/common";

// initializations
// validation schema
const getUsersReqBody = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getUsersReqBody ),
    statusCache(),
    async ( req, res, next ) => {
        const { USERSTATUS } = req;

        try {
            const users = await User.findAll( {
                where: { statusId: USERSTATUS.ACTIVE },
                attributes: ["id", "emailId", "firstName"],
                include: [
                    {
                        model: UserDp,
                        attributes: ["url", "createdAt"],
                        as: "dp"
                    }
                ]
            } );

            sendData( res, {
                users: users.map(
                    user => Object.assign(
                        {},
                        pick( user.toJSON(), ["id", "emailId", "firstName"] ),
                        { dpUrl: user.dp?.url ?? null }
                    )
                )
            } );

        } catch ( e ) {
            next( e );
        }
    }
]; 