import { redisclient } from "cache";
import UserStatus from "models/user/userStatus.model";
import PostStatus from "models/post/postStatus.model";
import { ServerError } from "@ssbdev/common";
import CommentStatus from "models/commentStatus.model";

const allowedTypes = ["user", "post", "comment"];

/**
 * - bool - true -> UserStatus model, USERSTATUS key in req
 * - bool - false -> PostStatus model, POSTSTATUS key in req
 * @default true
 */
export default ( type = "user" ) => ( req, res, next ) => {
    if ( !allowedTypes.includes( type ) ) throw new ServerError( `Invalid "Status Cache" type, should be one of ${ allowedTypes.toString() }` );

    const model = {
        user: UserStatus,
        post: PostStatus,
        comment: CommentStatus
    }[type];

    const key = {
        user: "USERSTATUS",
        post: "POSTSTATUS",
        comment: "COMMENTSTATUS"
    }[type];

    redisclient.get( key, async ( e, data ) => {
        try {

            if ( e ) throw e;

            if ( data ) {
                // set info on req
                req[key] = JSON.parse( data );
                return next();
            }

            const STATUS = {};
            const statuses = await model.findAll();
            for ( let status of statuses ) {
                if ( status.name === "active" ) STATUS.ACTIVE = status.id;
                else if ( status.name === "inactive" ) STATUS.INACTIVE = status.id;
            }

            if (
                !STATUS.hasOwnProperty( "ACTIVE" )
                || !STATUS.hasOwnProperty( "INACTIVE" )
            ) throw new ServerError( `"active" / "inactive" status not found in ${ key }` );

            // set in cache
            redisclient.set( key, JSON.stringify( STATUS ), ( e, ok ) => {
                if ( e ) throw e;

                // set info on req
                req[key] = STATUS;
                next();
            } );

        } catch ( e ) {
            next( e );
        }
    } );
};