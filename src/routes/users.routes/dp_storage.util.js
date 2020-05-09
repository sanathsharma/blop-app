import multer from 'multer';
import fs from 'fs';

// ---------------------------- multer setup -------------------------

const storage = multer.diskStorage( {
    destination ( req, file, callback ) {
        const path = './media/user_dp';

        // create folders if they dont exist
        if ( !fs.existsSync( path ) ) {
            fs.mkdirSync( path, { recursive: true } );
        }

        callback( null, path );
    },
    filename ( req, file, callback ) {
        // todo: create encrypted url instead
        callback( null, 'user_dp_' + req['userId'] + new Date().toISOString() + '.' + file.originalname.split( '.' ).pop() );
    }
} );

const types = ['image/png', 'image/jpeg', 'image/jpg'];

const upload = multer( {
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

export default upload;