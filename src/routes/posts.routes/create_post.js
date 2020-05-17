// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendError, sendData } from 'utils/response';

// models
import Category from 'models/category.model';
import PostStatus from 'models/post/postStatus.model';

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
        const { title, description, categoryId } = req.validatedBody;
        const userId = req.userId;

        try {
            const category = await Category.findByPk( categoryId );

            // if category does not exists
            if ( !category ) return sendError( res,
                message( "Something went wrong, could not create post", 'Category not found' ),
                message( "Could not create post", 'Category not found' )
            );

            // find active status id
            const status = await PostStatus.findOne( { where: { name: "active" } } );

            // if active status not found
            if ( !status ) return sendError( res,
                message( "Something went wrong, could not create post", '"Active" status not found' ),
                message( "Could not create post", 'No post status active found in db' )
            );

            // create post
            const post = await category.createPost( { title, description, statusId: status.id, addedBy: userId } );

            // send response
            sendData( res, { post: post.toJSON() } );
        } catch ( e ) {
            next( e );
        }
    }
];