// express
import express from 'express';

// vendors
import * as yup from 'yup';
import multer from 'multer';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
// models
// initializations
const router = express.Router();

// ---------------------------- multer setup -------------------------

const storage = multer.diskStorage( {
    destination ( req, file, callback ) {
        callback( null, './media' );
    },
    filename ( req, file, callback ) {
        callback( null, new Date().toISOString() + file.originalname );
    }
} );

const upload = multer( {
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter ( req, file, callback ) {
        if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' )
            callback( null, true );
        else
            // @ts-ignore
            callback( new Error( "Incorrect File Format. Accepted file formates are 'jpeg' & 'png' " ), false );
        /*
        * reject a file
        callback( null, false );
        * accept a file
        callback( null, true );
        * throw error for wrong file
        callback( new Error( "Incorrect File Format." ), false );
        */
    }
} );

// -------------------------- api's -------------------------------------------

const updateDpReqBody = yup.object().shape( {
    file: yup.string().required(),
    userId: yup.number().required()
} ).strict( true ).noUnknown( true );

// @ts-ignore
router.post( "/update_dp", validate( updateDpReqBody ), upload.single( 'file' ), ( req, res, next ) => {
    const { file, userId } = req.validatedBody;
    console.log( 'userId :', userId );
} );

export default router;