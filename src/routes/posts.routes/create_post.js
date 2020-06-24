// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import Category from 'models/category.model';

// common lib
import { NO_UNKNOWN, validate, sendData, BadRequestError } from '@ssbdev/common';

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
    statusCache( "post" ),
    async ( req, res, next ) => {
        const { title, description, categoryId } = req.validated.body;
        const { userId, POSTSTATUS } = req;

        try {
            const category = await Category.findByPk( categoryId );

            // if category does not exists
            if ( !category ) throw new BadRequestError( 'Category not found', "Something went wrong, could not create post" );

            // create post
            const post = await category.createPost( {
                title,
                description,
                statusId: POSTSTATUS.ACTIVE,
                addedBy: userId
            } );

            // send response
            sendData( res, { post: post.toJSON() } );

        } catch ( e ) {
            next( e );
        }
    }
];