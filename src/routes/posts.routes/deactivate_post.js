// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import Post from 'models/post/post.model';

// common lib
import { NO_UNKNOWN, validate, sendMessage, ServerError } from '@ssbdev/common';

// initializations
// validation schema
const deletePostReqBody = yup.object().shape( {
    postId: yup.number().positive().integer().required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( deletePostReqBody ),
    statusCache( "post" ),
    async ( req, res, next ) => {
        const { postId } = req.validated.body;
        const { userId, POSTSTATUS } = req;

        try {
            // find post (by user)
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    addedBy: userId,
                    statusId: POSTSTATUS.ACTIVE
                }
            } );

            // if post not found / not create by user -> does not matter, show deleted
            if ( !post ) return sendMessage( res, "Post Deleted" );

            // deactivate post
            await post.setStatus( POSTSTATUS.INACTIVE );

            // send response
            sendMessage( res, "Post Deleted" );

        } catch ( e ) {
            next( e );
        }
    }
];