// express
// vendors
import * as yup from 'yup';

// common
import { validate, NO_UNKNOWN, sendData } from "@ssbdev/common";

// middlewares
// utils
import { tokens } from "helpers/generateTokens";

// errors
import { BadRequestError } from "errors/bad-request-error";
import { UnauthorizedError } from "errors/unauthorized-error";

// models
// initializations
// validation schema

const refreshRequestBodySchema = yup.object().shape( {} ).strict( true ).noUnknown( NO_UNKNOWN );

/**
 * returns an accessToken if accessToken is invalid or not present,
 * valid refreshToken should be avaliable in the cookie
 * 
 * **Operation**
 * - (valid:access) >> (error:BadRequestError)
 * - (empty:access & valid:refresh) >> (new:access in resBody & new:refresh in cookies)
 * - (expired:access & valid:refresh) >> (new:access in resBody & new:refresh in cookies)
 * - (invalid:access & valid:refresh) >> (new:access in resBody & new:refresh in cookies)
 * - (*:access & invalid:refresh) >> (error:UnauthorizedError)
 * 
 * alternative implementaion
 * - need not check the accessToken instead just check the validity of the refresh token and send back a accessToken
 * - here it doenst matter if the accessToken with the user is still valid or not
 * - **problem** if the accessToken is blacklisted and refreshToken is not then new accessToken will be generated;
 * - **solution** check if the current access and refresh token is blacklisted and then generate new **Tokens**
 */
export default [
    validate( refreshRequestBodySchema ),
    ( req, res, next ) => {
        // throw error if accessToken is valid
        if ( req.isAuth ) throw new BadRequestError( "Token still valid" );

        const refreshToken = req.session?.refresh;

        const invalidRefreshToken = !refreshToken || refreshToken === "";

        try {
            // just throw an error, which gets caught in the catch block and sends unauthorized error
            if ( invalidRefreshToken ) throw new Error();

            // error will be thrown if refresh token is invalid
            const newRefreshToken = tokens.refresh.refresh( refreshToken );

            // control will come here if refreshToken is valid & new refreshToken was successfully generated
            // if invalid access token
            const payload = tokens.refresh.decode( refreshToken );

            // generates a accessToken with payload if payload is present 
            const newAccessToken = tokens.access.generate(
                // clean the payload of prev token info w/ keys like exp, iat, etc. before generating
                tokens.access.cleanPayload( payload )
            );

            // set the refresh token in cookie
            req.session = { refresh: newRefreshToken };

            // send the newly generated accessToken in response body
            sendData( res, {
                accessToken: newAccessToken
            } );

        } catch ( e ) {
            throw new UnauthorizedError( "Invalid access / refresh token" );
        }
    }
];