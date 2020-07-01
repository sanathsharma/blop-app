// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
// models
import FavoritePost from 'models/favoritePost.model';
import ReadLaterPost from 'models/readLaterPost.model';

// common lib
import { NO_UNKNOWN, validate, sendMessage, RequestValidationError, NotFoundError } from '@ssbdev/common';

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

        const { postId } = req.validated.body;
        const userId = req.userId;

        if ( !postId && !req.validated.body[idKey] ) throw new RequestValidationError(
            `One of 'postId','${ idKey }' is required`,
            `Something went wrong, could not remove post from ${ messageKey }`
        );

        const where = {};

        // find by id
        if ( req.validated.body[idKey] ) where.id = req.validated.body[idKey];

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
            if ( !instance ) throw new NotFoundError( `Post not found in ${ messageKey }` );

            // delete favorited Post
            await instance.destroy();

            // send response
            sendMessage( res, `Removed from ${ messageKey }` );

        } catch ( e ) {
            next( e );
        }
    }
];