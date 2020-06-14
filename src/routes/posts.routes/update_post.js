// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
import uploadPostImage from './postImage_storage.util';

// models
import Post from 'models/post/post.model';
import PostImage from 'models/post/postImage.model';
import PostStatus from 'models/post/postStatus.model';

// common lib
import { NO_UNKNOWN, validate, sendMessage, sendData, RequestValidationError, NotFoundError } from '@ssbdev/common';

// initializations
// validation schema (formData)
const updatePostReqBody = yup.object().shape( {
    postId: yup.string().required( "postId required" ),
    title: yup.string().trim().min( 10 ).notRequired(),
    description: yup.string().trim().notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    uploadPostImage.single( 'image' ),
    validate( updatePostReqBody ),
    async ( req, res, next ) => {
        const { postId, title, description } = req.validated.body;
        const userId = req.userId;
        const image = req.file; // image uploaded

        // todo: write helper util for positive integer
        // TODO: prodMsg "Something went wrong, could not update post" 
        if ( isNaN( parseInt( postId ) ) ) throw new RequestValidationError( "postId invalid" );

        if ( !title && !description && !image ) return sendMessage( res, "Post upto date" );

        const allowedUpdates = ["title", "description"];

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    addedBy: userId,
                    "$status.name$": "active",
                },
                include: [
                    {
                        model: PostStatus,
                        attributes: ['name'],
                        as: "status"
                    }, {
                        model: PostImage,
                        attributes: ['url'],
                        as: "image"
                    }
                ]
            } );

            // if post not found
            if ( !post ) throw new NotFoundError( "post not found" );

            // update changes on post instance
            allowedUpdates.forEach( key => {
                if ( req.validated.body[key] ) post[key] = req.validated.body[key];
            } );

            let newImage = null;
            // if image uploaded
            if ( image )
                // update if exists
                if ( post.image )
                    post.image.url = `post_image/${ image.filename }`;

                // create if does not exists
                else newImage = await post.createImage( { url: `post_image/${ image.filename }` } );

            // save changes
            if ( post.changed() || ( post.image && post.image.changed() ) ) await post.save();

            const imagePath = newImage
                ? newImage.url
                : post.image && post.image.changed()
                    ? post.image.url
                    : undefined;

            // if image changed or created
            if ( imagePath )
                sendData( res, {
                    imageUrl: imagePath
                } );

            // if image not changed / created
            else sendMessage( res, "Post Updated" );

        } catch ( e ) {
            next( e );
        }
    }
];