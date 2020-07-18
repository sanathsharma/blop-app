import { CustomError } from '@ssbdev/common';

export const NOT_FOUND_ERROR = "NotFoundError";

export class NotFoundError extends CustomError {
    statusCode = 200;

    constructor( msg ) {
        super();

        this.name = NOT_FOUND_ERROR;
        this.message = msg;

        // because we are expending a builtin class
        Object.setPrototypeOf( this, NotFoundError.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}