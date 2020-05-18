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
import ReadLaterPost from 'models/readLaterPost.model';

// initializations
// validation schema
const reqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required( "postId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default ( isFavorities = false ) => [
    validate( reqBodySchema ),
    async ( req, res, next ) => {
        const model = isFavorities ? FavoritePost : ReadLaterPost;

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
            const [instance, created] = await model.findOrCreate( {
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
            if ( created ) return sendMessage( res,
                isFavorities ? "Added to favorites" : "Added to Read Later"
            );

            // if created before
            sendMessage( res,
                isFavorities ? "Post already in favorites" : "Post already in read later"
            );

        } catch ( e ) {
            next( e );
        }
    }
];