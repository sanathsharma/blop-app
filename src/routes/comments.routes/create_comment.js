// express
// vendors
import *  as yup from 'yup';

// middleware
import statusCache from 'middleware/statusCache';

// common lib
import { validate, sendData, NO_UNKNOWN, BadRequestError } from '@ssbdev/common';

// utils
import { COMMENT_DESC_MAX_CHAR } from 'constants/others.constants';

// models
import Post from 'models/post/post.model';
import Comment from 'models/comment.model';

// initializations
// validation schema
const createCommentReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required(),
    parent: yup.number().positive().integer().nullable( true ).notRequired(),
    description: yup.string().trim().max( COMMENT_DESC_MAX_CHAR ).required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( createCommentReqBodySchema ),
    statusCache( "post" ),
    statusCache( "comment" ),
    async ( req, res, next ) => {
        const { postId, description, parent = null } = req.validated.body;
        const { userId, POSTSTATUS, COMMENTSTATUS } = req;

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    statusId: POSTSTATUS.ACTIVE
                }
            } );

            // if post not found
            if ( !post ) throw new BadRequestError( "Post not found", "Could not create comment" );

            // create comment
            const newComment = await Comment.create( {
                description,
                postId,
                addedBy: userId,
                statusId: COMMENTSTATUS.ACTIVE,
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