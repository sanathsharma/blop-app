import { CustomError, ifProd } from '@ssbdev/common';

export const UNAUTHORIZED_ERROR = "UnauthorizedError";

export class UnauthorizedError extends CustomError {
    statusCode = 200;

    constructor( devMsg ) {
        super();

        devMsg = devMsg ?? "Unauthorized";

        this.name = UNAUTHORIZED_ERROR;
        this.message = ifProd( "Unauthorized", devMsg );

        // because we are expending a builtin class
        Object.setPrototypeOf( this, UnauthorizedError.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}