// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendMessage } from 'utils/response';

// models
import Post from 'models/post/post.model';
import FavoritePost from 'models/favoritePost.model';
import PostStatus from 'models/post/postStatus.model';

// initializations
// validation schema
const addToFavoritiesReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required( "postId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( addToFavoritiesReqBodySchema ),
    async ( req, res, next ) => {
        const { postId } = req.validatedBody;
        const userId = req.userId;

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    "$status.name$": "active"
                },
                include: [{
                    model: PostStatus,
                    attributes: ['name'],
                    as: "status"
                }]
            } );

            // if post not found
            if ( !post ) return sendError( res, "Post not found", "Post not found" );

            // check if post is favorites for the user or create
            const [favoritePost, created] = await FavoritePost.findOrCreate( {
                where: {
                    postId,
                    addedBy: userId
                },
                defaults: {
                    postId,
                    addedBy: userId
                }
            } );

            // if created now
            if ( created ) return sendMessage( res, "Added to favorites" );

            // if created before
            sendMessage( res, "Post already in favorites" );

        } catch ( e ) {
            next( e );
        }
    }
];