// vendors
import jwt from 'jsonwebtoken';

// utils
import message from 'utils/message';

export default function ( req, res, next ) {
    const authHeader = req.get( 'Authorization' );
    if ( !authHeader ) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split( ' ' )[1]; // "Token <token>"
    if ( !token || token === "" ) {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify( token, process.env.JWT_SECRET );
    } catch ( e ) {
        req.isAuth = false;
        return next();
    }
    if ( !decodedToken ) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    // @ts-ignore
    req.userId = decodedToken.userId;
    next();
}

export const checkAuth = ( req, res, next ) => {
    if ( !req['isAuth'] )
        return res
            .status( 200 )
            .json( {
                status: "error",
                message: "Unauthorized",
                error: {
                    message: message( "Unauthorized", "Token not found / Token Expired" )
                }
            } );
    next();
};