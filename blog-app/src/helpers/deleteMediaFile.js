import { MEDIA_DIR } from "constants/app.constants";
import fs from 'fs';

const deleteMediaFile = ( path ) => {
    fs.unlink( `${ MEDIA_DIR }/${ path }`, ( e ) => {
        // if error is present, put the file path in cache, and retry later
    } );
};

export {
    deleteMediaFile
};