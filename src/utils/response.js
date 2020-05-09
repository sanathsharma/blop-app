export const sendServerError = ( res ) => ( error ) => ( console.log( error ), res.status( 200 ).json( {
    status: "error",
    message: "Server Error",
    error: error
} ) );

export const sendMessage = ( res, message ) => res.status( 200 ).json( {
    status: "success",
    message
} );

export const sendError = ( res, message, errorMessage ) => res.status( 200 ).json( {
    status: "error",
    message,
    error: {
        message: errorMessage
    }
} );

export const sendData = ( res, data, message ) => res.status( 200 ).json( {
    status: "success",
    message,
    data
} );