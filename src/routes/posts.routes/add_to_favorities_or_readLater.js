// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import Post from 'models/post/post.model';
import FavoritePost from 'models/favoritePost.model';
import ReadLaterPost from 'models/readLaterPost.model';

// common lib
import { NO_UNKNOWN, validate, sendMessage, NotFoundError } from '@ssbdev/common';

// initializations
// validation schema
const reqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required( "postId is required" )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default ( isFavorities = false ) => [
    validate( reqBodySchema ),
    statusCache( "post" ),
    async ( req, res, next ) => {
        const model = isFavorities ? FavoritePost : ReadLaterPost;

        const { postId } = req.validated.body;
        const { userId, POSTSTATUS } = req;

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    statusId: POSTSTATUS.ACTIVE
                }
            } );

            // if post not found
            if ( !post ) throw new NotFoundError( "Post not found" );

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