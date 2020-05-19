// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendMessage } from 'utils/response';

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
        const { commentId } = req.validatedBody;
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
            if ( !comment ) return sendError( res,
                message( "Comment Deleted", "Comment not found / already deactivated" ),
                message( "Comment Deleted", "Comment not found / already deactivated" )
            );

            // find inactive comment status
            const commentStatus = await CommentStatus.findOne( {
                where: {
                    name: "inactive"
                }
            } );

            // if comment inactive status not found
            if ( !commentStatus ) return sendError( res,
                message( "Comment Deleted", "Inactive comment status not found" ),
                message( "Comment Deleted", "Inactive comment status not found" )
            );

            // deactivate comment 
            await comment.setStatus( commentStatus.id );

            // send response
            sendMessage( res, "Comment Deleted" );

        } catch ( e ) {
            next( e );
        }
    }
];