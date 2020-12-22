// express
// vendors
import * as yup from 'yup';
import { QueryTypes, Op } from 'sequelize';
import { omit } from "lodash";

// middlewares
import statusCache from 'middleware/statusCache';

// db
import db from 'db';

// utils
// models
import User from "models/user/user.model";

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// errors
import { NotFoundError } from "errors/not-found-error";

// initializations
// validation schema
const getUserReqBodySchema = yup.object().shape( {
    userId: yup.number().positive().integer()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getUserReqBodySchema ),
    statusCache(),
    async ( req, res, next ) => {
        let { userId } = req.validated.body;
        const { USERSTATUS } = req;

        // send current user if user id not present in request body
        if ( !userId ) userId = req.auth.userId;

        try {
            const [user] = await db.query( `
                SELECT "u"."id", "emailId","dp"."url" AS "dpUrl", "firstName", "lastName", "bio"
                FROM "Users" AS "u"
                LEFT JOIN "UserDps" AS "dp"
                ON "u"."dpId"="dp"."id"
                WHERE "u"."id" = :userId AND "u"."statusId" = :statusId
            `, {
                replacements: {
                    userId,
                    statusId: ( USERSTATUS.ACTIVE, USERSTATUS.NOT_VERIFIED )
                },
                // raw: true, // direct data instead of instance
                type: QueryTypes.SELECT,
                nest: true,
                model: User,
                mapToModel: true,
            } );

            // const user = await User.findOne( {
            //     where: {
            //         id: userId,
            //         statusId: {
            //             [Op.in]: [USERSTATUS.ACTIVE, USERSTATUS.NOT_VERIFIED]
            //         }
            //     },
            //     attributes: {
            //         exclude: ['dpId', 'password', 'createdAt', 'updatedAt']
            //     },
            //     include: [
            //         {
            //             model: UserDp,
            //             attributes: ['url'],
            //             as: "dp"
            //         }
            //     ]
            // } );

            // if user not found
            if ( !user ) throw new NotFoundError( "User not found" );

            sendData( res, { user: omit( user.toJSON(), ["statusId", "firstName", "lastName"] ) } );

        } catch ( e ) {
            next( e );
        }
    }];