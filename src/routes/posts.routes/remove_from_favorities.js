// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendMessage } from 'utils/response';

// models
import FavoritePost from 'models/favoritePost.model';

// initializations
// validation schema
const removeFromFavoritiesReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().notRequired(),
    favoritePostId: yup.number().positive().integer().notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( removeFromFavoritiesReqBodySchema ),
    async ( req, res, next ) => {
        const { postId, favoritePostId } = req.validatedBody;
        const userId = req.userId;

        if ( !postId && !favoritePostId ) return sendError( res,
            message( "Something went wrong, could not remove post from favorities", "One of 'postId','favoritePostId' is required" ),
            message( "Could not remove post from favorities", "One of 'postId','favoritePostId' is required" )
        );

        const where = {};

        // find by id
        if ( favoritePostId ) where.id = favoritePostId;

        // find by post id favorited by the user
        else {
            where.postId = postId;
            where.addedBy = userId;
        }

        try {
            const favoritePost = await FavoritePost.findOne( {
                where
            } );

            // if favoritePost not found
            if ( !favoritePost ) return sendError( res,
                message( "Something went wrong, could not remove post from favorities", "Post not found in favorities" ),
                message( "Could not remove post from favorities", "Post not found in favorities" )
            );

            // delete favorited Post
            await favoritePost.destroy();

            // send response
            sendMessage( res, "Removed from favorities" );
        } catch ( e ) {
            next( e );
        }
    }
];