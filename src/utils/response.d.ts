import { Response } from 'express';

export declare const sendServerError: ( res: Response ) => ( error: Error ) => any;

export declare const sendMessage: ( res: Response, message: string ) => any;

export declare const sendError: ( res: Response, message: string, errorMessage: string ) => any;

export declare const sendData: ( res: Response, data: {
    [x: string]: any;
}, message?: string ) => any;
