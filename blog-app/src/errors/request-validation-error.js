import { CustomError, ifProd, YUP_REQUEST_VALIDATION_ERROR } from '@ssbdev/common';

export const REQUEST_VALIDATION_ERROR = YUP_REQUEST_VALIDATION_ERROR;
export class RequestValidationError extends CustomError {
    statusCode = 200;
    errors = {};

    constructor( devMsg, prodMsg = "Something went wrong" ) {
        super();

        this.name = REQUEST_VALIDATION_ERROR;
        this.message = ifProd( prodMsg, devMsg );

        // because we are expending a builtin class
        Object.setPrototypeOf( this, RequestValidationError.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}