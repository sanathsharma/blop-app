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
import ReadLaterPost from 'models/readLaterPost.model';

// initializations
// validation schema
const removeFromFavoritiesReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().notRequired(),
    favoritePostId: yup.number().positive().integer().notRequired(),
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

const removeFromReadLaterReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().notRequired(),
    readLaterPostId: yup.number().positive().integer().notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default ( isFavorites = false ) => [
    validate( isFavorites ? removeFromFavoritiesReqBodySchema : removeFromReadLaterReqBodySchema ),
    async ( req, res, next ) => {
        // constants
        const model = isFavorites ? FavoritePost : ReadLaterPost;
        const messageKey = isFavorites ? "favorities" : "read later";
        const idKey = isFavorites ? "favoritePostId" : "readLaterPostId";

        const { postId } = req.validatedBody;
        const userId = req.userId;

        if ( !postId && !req.validatedBody[idKey] ) return sendError( res,
            message( `Something went wrong, could not remove post from ${ messageKey }`, `One of 'postId','${ idKey }' is required` ),
            message( `Could not remove post from ${ messageKey }`, `One of 'postId','${ idKey }' is required` )
        );

        const where = {};

        // find by id
        if ( req.validatedBody[idKey] ) where.id = req.validatedBody[idKey];

        // find by post id favorited by the user
        else {
            where.postId = postId;
            where.addedBy = userId;
        }

        try {
            const instance = await model.findOne( {
                where
            } );

            // if favoritePost not found
            if ( !instance ) return sendError( res,
                message( `Something went wrong, could not remove post from ${ messageKey }`, `Post not found in ${ messageKey }` ),
                message( `Could not remove post from ${ messageKey }`, `Post not found in ${ messageKey }` )
            );

            // delete favorited Post
            await instance.destroy();

            // send response
            sendMessage( res, `Removed from ${ messageKey }` );

        } catch ( e ) {
            next( e );
        }
    }
];