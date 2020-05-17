// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendMessage, sendError } from 'utils/response';

// models
import Post from 'models/post/post.model';
import PostStatus from 'models/post/postStatus.model';

// initializations
// validation schema
const deletePostReqBody = yup.object().shape( {
    postId: yup.number().positive().integer().required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deletePostReqBody ),
    async ( req, res, next ) => {
        const { postId } = req.validatedBody;
        const userId = req.userId;

        try {
            // find post (by user)
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    addedBy: userId,
                    "$status.name$": "active"
                },
                include: [{
                    model: PostStatus,
                    attributes: ['name'],
                    as: "status"
                }]
            } );

            // if post not found / not create by user -> does not matter, show deleted
            if ( !post ) return sendMessage( res, "Post Deleted" );

            // find inactive status id
            const status = await PostStatus.findOne( { where: { name: "inactive" } } );

            // if active status not found
            if ( !status ) return sendError( res,
                message( "Something went wrong, could not delete post", "'Inactive' status not found" ),
                message( "Could not delete post", 'No post status active found in db' )
            );

            // deactivate post
            await post.setStatus( status.id );

            // send response
            sendMessage( res, "Post Deleted" );

        } catch ( e ) {
            next( e );
        }
    }
];