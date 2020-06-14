// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
import { COMMENT_DESC_MAX_CHAR } from 'constants/others.constants';
import CommentStatus from 'models/commentStatus.model';
import Comment from 'models/comment.model';

// common lib
import { NO_UNKNOWN, validate, sendMessage, BadRequestError } from '@ssbdev/common';

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
        const { commentId, description } = req.validated.body;
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
            if ( !comment ) throw new BadRequestError( "Comment not found / already deactivated", "Could not update comment" );

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