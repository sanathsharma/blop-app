import { CustomError } from '@ssbdev/common';

export const DUPLICATE_ERROR_NAME = "DuplicateEntryError";

export class DuplicateEntryError extends CustomError {
    statusCode = 200;

    constructor() {
        super();

        this.name = DUPLICATE_ERROR_NAME;
        this.message = "Duplicate Entry";

        // because we are expending a builtin class
        Object.setPrototypeOf( this, DuplicateEntryError.prototype );
    };

    serializeError = () => {
        return [{ message: this.message, name: this.name }];
    };
}