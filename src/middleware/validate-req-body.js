import yupValidate from "utils/yupValidate";

const validate = ( schema ) => async ( req, res, next ) => {
    try {
        req.validatedBody = await yupValidate( schema, req.body );
        next();
    } catch ( e ) {
        res.status( 200 ).json( {
            status: "error",
            message: "Invalid Request",
            error: e
        } );
    }
};

export default validate;