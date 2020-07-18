import { CustomError, ifProd } from '@ssbdev/common';

export const BAD_REQUEST_ERROR = "BadRequestError";

export class BadRequestError extends CustomError {
    statusCode = 200;

    constructor( devMsg, prodMsg = "Bad request" ) {
        super();

        this.name = BAD_REQUEST_ERROR;
        this.message = ifProd( prodMsg, devMsg );

        // because we are expending a builtin class
        Object.setPrototypeOf( this, BadRequestError.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}