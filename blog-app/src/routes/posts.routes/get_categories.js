// vendors
import * as yup from 'yup';

// common
import { NO_UNKNOWN, validate, sendData } from "@ssbdev/common";

// models
import Category from "models/category.model";

// -----------------------------------------------------------------------------------
// schema
const getCategoriesSchema = {
    body: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    params: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    query: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
};

// -----------------------------------------------------------------------------------

export default [
    validate(
        getCategoriesSchema.body,
        getCategoriesSchema.params,
        getCategoriesSchema.query,
    ),
    async ( req, res, next ) => {
        try {
            const categories = await Category.findAll();

            sendData( res, {
                categories: categories.map( category => category.toJSON() )
            } );
        } catch ( e ) {
            next( e );
        }
    }
];