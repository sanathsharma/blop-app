// express
// vendors
import * as yup from 'yup';
import { pick } from "lodash";

// middlewares
import statusCache from 'middleware/statusCache';

// utils
import { checkId } from "helpers/checkId";
import uploadPostImage from "./postImage_storage.util";

// models
import Category from 'models/category.model';

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// errors
import { BadRequestError } from "errors/bad-request-error";
import { RequestValidationError } from "errors/request-validation-error";

// initializations
// validation schema
const createPostReqBody = yup.object().shape( {
    title: yup.string().trim().min( 10 ).required( 'title is required' ),
    description: yup.string().trim().required( 'description is required' ),
    categoryId: yup.string().required( 'categoryId is required' )
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// todo: add image
export default [
    uploadPostImage.single( "image" ),
    validate( createPostReqBody ),
    statusCache( "post" ),
    async ( req, res, next ) => {
        const { title, description, categoryId } = req.validated.body;
        const { POSTSTATUS, file } = req;
        const { userId } = req.auth;

        try {

            if ( !checkId( categoryId ) ) throw new RequestValidationError( "Invalid categoryId" );

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

            let image;
            // if image uploaded
            if ( file )
                image = await post.createImage( { url: `post_image/${ file.filename }` }, { raw: true } );

            // send response
            sendData( res, {
                post: Object.assign(
                    pick(
                        post, ["id", "title", "description", "categoryId", "addedBy"]
                    ),
                    { imageURL: image?.url ?? null }
                )
            } );

        } catch ( e ) {
            next( e );
        }
    }
];