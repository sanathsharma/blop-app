// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
import { COMMENT_DESC_MAX_CHAR, NO_UNKNOWN } from 'utils/constants';
import validate from 'middleware/validate-req-body';
import CommentStatus from 'models/commentStatus.model';
import { sendError, sendMessage } from 'utils/response';
import message from 'utils/message';
import Comment from 'models/comment.model';

// models
// initializations
// validation schema
const updateCommentReqBodySchema = yup.object().shape( {
    commentId: yup.number().positive().integer().required(),
    description: yup.string().trim().max( COMMENT_DESC_MAX_CHAR ).required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( updateCommentReqBodySchema ),
    async ( req, res, next ) => {
        const { commentId, description } = req.validatedBody;
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
                message( "Could not update comment", "Comment not found / already deactivated" ),
                message( "Could not update comment", "Comment not found / already deactivated" )
            );

            // update comment
            comment.description = description;

            // save changes
            await comment.save();

            // send response
            sendMessage( res, "Comment updated" );

        } catch ( e ) {
            next( e );
        }
    }
];