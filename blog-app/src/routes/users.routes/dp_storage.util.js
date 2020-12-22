// vendors
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';

// node
import fs from 'fs';

// constants
import { USER_DP_DIR } from "constants/app.constants";

// ----------------------------------------------------------------------
// multer

const storage = multer.diskStorage( {
    destination ( req, file, callback ) {
        const path = USER_DP_DIR;

        // create folders if they dont exist
        if ( !fs.existsSync( path ) ) {
            fs.mkdirSync( path, { recursive: true } );
        }

        callback( null, path );
    },
    filename ( req, file, callback ) {
        callback( null, uuid() + '.' + file.originalname.split( '.' ).pop() );
    }
} );

const types = ['image/png', 'image/jpeg', 'image/jpg'];

const uploadUserDp = multer( {
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter ( req, file, callback ) {
        if ( types.includes( file.mimetype ) )
            callback( null, true );
        else
            callback( new Error( "Incorrect File Format. Accepted file formates are 'jpeg', 'jpg' & 'png' " ) );
    },
} );


// ----------------------------------------------------------------------
// sharp

const resizeImage = async ( req, res, next ) => {
    if ( !req.file ) return next();
    const images = {
        "96x96": `${ uuid() }.jpeg`,
        "150x150": `${ uuid() }.jpeg`,
    };

    try {
        await sharp( req.file.path )
            .resize( 96 )
            .toFormat( 'jpeg' )
            .toFile( `${ USER_DP_DIR }/${ images["96x96"] }` );

        await sharp( req.file.path )
            .resize( 150 )
            .toFormat( "jpeg" )
            .toFile( `${ USER_DP_DIR }/${ images["150x150"] }` );

        req.validated.images = images;
        next();

    } catch ( e ) {
        next( e );
    }
};

export {
    resizeImage,
    uploadUserDp
};