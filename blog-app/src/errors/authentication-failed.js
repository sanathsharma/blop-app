import { CustomError } from '@ssbdev/common';

export const AUTHENTICATION_FALIED = "AuthenticationFailedError";

export class AuthenticationFailed extends CustomError {
    statusCode = 200;

    constructor() {
        super();

        this.name = AUTHENTICATION_FALIED;
        this.message = "Authentication Failed";

        // because we are expending a builtin class
        Object.setPrototypeOf( this, AuthenticationFailed.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}