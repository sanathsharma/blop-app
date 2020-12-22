// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// constants
import { COMMENT_DESC_MAX_CHAR } from 'constants/app.constants';

// common lib
import { NO_UNKNOWN, validate, sendMessage } from '@ssbdev/common';

// models
import Comment from 'models/comment.model';

// errors
import { BadRequestError } from "errors/bad-request-error";

// initializations
// validation schema
const updateCommentReqBodySchema = yup.object().shape( {
    commentId: yup.number().positive().integer().required(),
    description: yup.string().trim().max( COMMENT_DESC_MAX_CHAR ).required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( updateCommentReqBodySchema ),
    statusCache( "comment" ),
    async ( req, res, next ) => {
        const { commentId, description } = req.validated.body;
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