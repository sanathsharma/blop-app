function yupValidate ( schema, obj ) {
    const promise = schema.validate( obj, { abortEarly: false, } );

    return new Promise( ( resolve, reject ) => {
        promise
            .then( ( validatedObj ) => {
                resolve( validatedObj );
            } )
            .catch( errors => {
                const errorsObj = {};
                errors.inner.forEach( ( each ) => {
                    errorsObj[each.path] = each.message;
                } );
                reject( errorsObj );
            } );
    } );
};

export default yupValidate;
