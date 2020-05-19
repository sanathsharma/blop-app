const exclude = ( obj, keysArr ) => {
    const result = {};
    Object.keys( obj ).forEach( key => {
        if ( !keysArr.includes( key ) ) result[key] = obj[key];
    } );
    return result;
};

export default exclude;