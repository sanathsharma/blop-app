// express
// vendors
import *  as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { sendError, sendData } from 'utils/response';
import { COMMENT_DESC_MAX_CHAR, NO_UNKNOWN } from 'utils/constants';

// models
import Post from 'models/post/post.model';
import PostStatus from 'models/post/postStatus.model';
import CommentStatus from 'models/commentStatus.model';

// initializations
// validation schema
const createCommentReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required(),
    parent: yup.number().positive().integer().nullable( true ).notRequired(),
    description: yup.string().trim().max( COMMENT_DESC_MAX_CHAR ).required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( createCommentReqBodySchema ),
    async ( req, res, next ) => {
        const { postId, description, parent = null } = req.validatedBody;
        const userId = req.userId;

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    "$status.name$": "active"
                },
                include: [
                    {
                        model: PostStatus,
                        attributes: ['name'],
                        as: "status"
                    }
                ]
            } );

            // if post not found
            if ( !post ) return sendError( res,
                message( "Could not create comment", "Post not found" ),
                message( "Could not create comment", "Post not found" )
            );

            // find active comment status 
            const commentStatus = await CommentStatus.findOne( {
                where: {
                    name: "active"
                }
            } );

            // if status not found
            if ( !commentStatus ) return sendError( res,
                message( "Could not create comment", "Active comment status not found" ),
                message( "Could not create comment", "Active comment status not found" )
            );

            // create comment
            const newComment = await post.createComment( {
                description,
                postId,
                addedBy: userId,
                statusId: commentStatus.id,
                parent
            } );

            sendData( res, {
                comment: newComment.toJSON()
            } );
        } catch ( e ) {
            next( e );
        }
    }
];