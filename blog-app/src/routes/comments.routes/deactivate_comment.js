// express
// vendors
import * as yup from 'yup';

// middleware
import statusCache from 'middleware/statusCache';

// common lib
import { NO_UNKNOWN, validate, sendMessage } from '@ssbdev/common';

// models
import Comment from 'models/comment.model';

// errors
import { BadRequestError } from "errors/bad-request-error";

// initializations
// validation schema
const deactivateCommentReqBodySchema = yup.object().shape( {
    commentId: yup.number().positive().integer().required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deactivateCommentReqBodySchema ),
    statusCache( "comment" ),
    async ( req, res, next ) => {
        const { commentId } = req.validated.body;
        const { COMMENTSTATUS } = req;
        const { userId } = req.auth;

        try {
            // find comment and check if comment created by this user
            const comment = await Comment.findOne( {
                where: {
                    id: commentId,
                    addedBy: userId,
                    statusId: COMMENTSTATUS.ACTIVE
                }
            } );

            // if comment not found
            if ( !comment ) {
                if ( process.env.NODE_ENV !== "development" ) return sendMessage( res, "Comment Deleted" );
                throw new BadRequestError( "Comment not found / already deactivated" );
            }

            // deactivate comment 
            await comment.setStatus( COMMENTSTATUS.INACTIVE );

            // send response
            sendMessage( res, "Comment Deleted" );

        } catch ( e ) {
            next( e );
        }
    }
];