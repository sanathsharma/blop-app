// express
// vendors
import * as yup from 'yup';

// common lib
import { NO_UNKNOWN, validate, sendMessage, BadRequestError, ServerError } from '@ssbdev/common';

// models
import Comment from 'models/comment.model';
import CommentStatus from 'models/commentStatus.model';

// initializations
// validation schema
const deactivateCommentReqBodySchema = yup.object().shape( {
    commentId: yup.number().positive().integer().required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deactivateCommentReqBodySchema ),
    async ( req, res, next ) => {
        const { commentId } = req.validated.body;
        const userId = req.userId;

        try {
            // find comment and check if comment created by this user
            const comment = await Comment.findOne( {
                where: {
                    id: commentId,
                    addedBy: userId,
                    "$status.name$": "active"
                },
                include: [{
                    model: CommentStatus,
                    attributes: ['name'],
                    as: "status"
                }]
            } );

            // if comment not found
            if ( !comment ) {
                if ( process.env.NODE_ENV !== "development" ) return sendMessage( res, "Comment Deleted" );
                throw new BadRequestError( "Comment not found / already deactivated" );
            }

            // find inactive comment status
            const commentStatus = await CommentStatus.findOne( {
                where: {
                    name: "inactive"
                }
            } );

            // if comment inactive status not found
            if ( !commentStatus ) {
                if ( process.env.NODE_ENV !== "development" ) return sendMessage( res, "Comment Deleted" );
                throw new ServerError( "Inactive comment status not found" );
            }

            // deactivate comment 
            await comment.setStatus( commentStatus.id );

            // send response
            sendMessage( res, "Comment Deleted" );

        } catch ( e ) {
            next( e );
        }
    }
];