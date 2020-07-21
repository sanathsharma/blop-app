import { isInteger } from "lodash";

const isValidId = ( id ) => {
    const num = parseFloat( id );
    // isInteger also check if number is not NaN
    return isInteger( num ) && num > 0;
};

export {
    isValidId
};