import { isInteger } from "lodash";

const checkId = ( id ) => isInteger( parseFloat( id ) );

export {
    checkId
};