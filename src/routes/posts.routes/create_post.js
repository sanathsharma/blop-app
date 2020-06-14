// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
// models
import Category from 'models/category.model';
import PostStatus from 'models/post/postStatus.model';

// common lib
import { NO_UNKNOWN, validate, sendData, BadRequestError, ServerError } from '@ssbdev/common';

// initializations
// validation schema
const createPostReqBody = yup.object().shape( {
    title: yup.string().trim().min( 10 ).required( 'title is required' ),
    description: yup.string().trim().required( 'description is required' ),
    categoryId: yup.number().required( 'categoryId is required' )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// todo: add image
export default [
    validate( createPostReqBody ),
    async ( req, res, next ) => {
        const { title, description, categoryId } = req.validated.body;
        const userId = req.userId;

        try {
            const category = await Category.findByPk( categoryId );

            // if category does not exists
            if ( !category ) throw new BadRequestError( 'Category not found', "Something went wrong, could not create post" );

            // find active status id
            const status = await PostStatus.findOne( { where: { name: "active" } } );

            // if active status not found
            if ( !status ) throw new ServerError( '"Active" status not found', "Something went wrong, could not create post" );

            // create post
            const post = await category.createPost( { title, description, statusId: status.id, addedBy: userId } );

            // send response
            sendData( res, { post: post.toJSON() } );

        } catch ( e ) {
            next( e );
        }
    }
];