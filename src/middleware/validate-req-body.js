import yupValidate from "utils/yupValidate";

const validate = ( schema ) => async ( req, res, next ) => {
    try {
        req.validatedBody = await yupValidate( schema, req.body );
        next();
    } catch ( e ) {
        const message = "Something went wrong";
        const isProduction = process.env.NODE_ENV === "production";

        res.status( 200 ).json( {
            status: "error",
            message: isProduction ? message : "Invalid Request",
            error: isProduction ? { message } : e
        } );
    }
};

export default validate;