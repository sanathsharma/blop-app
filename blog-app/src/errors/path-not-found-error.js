import { CustomError, ifProd } from '@ssbdev/common';

export const PATH_NOT_FOUND_ERROR = ifProd( "Not Found", "PathNotFoundError" );

export class PathNotFoundError extends CustomError {
    statusCode = 200;

    constructor() {
        super();

        this.name = PATH_NOT_FOUND_ERROR;
        this.message = ifProd( "Not Found", "Path not found" );

        // because we are expending a builtin class
        Object.setPrototypeOf( this, PathNotFoundError.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}