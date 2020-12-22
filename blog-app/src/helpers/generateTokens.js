// vendors
import jwt from "jsonwebtoken";

// constants
import {
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME,
    RESET_PASSWORD_TOKEN_LIFETIME,
    TOKEN_EXPIRED_ERROR_NAME,
    VERIFY_USER_TOKEN_LIFETIME
} from "constants/app.constants";

// -----------------------------------------------------------------------------------------

const clean = function ( payload ) {

    delete payload.exp;
    delete payload.iat;
    delete payload.nbf;
    delete payload.jti;
    delete payload.aud;
    delete payload.sub;
    delete payload.iss;

    return payload;
};

// -----------------------------------------------------------------------------------------

// todo: add additional info, like issuer
const tokens = {
    access: {
        expiresIn: ACCESS_TOKEN_LIFETIME,
        /**
         * @param {Record<string,any>} payload 
         */
        generate: function ( payload ) {
            return jwt.sign(
                payload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: this.expiresIn }
            );
        },
        /**
         * @param {Record<string,any>} payload
         */
        cleanPayload: clean,
        /**
         * @param {String} token
         */
        verify: ( token ) => jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        ),
        /**
         * @param {String} token 
         */
        refresh: function ( token ) {
            /** @type {object} */
            let decoded;

            try {
                decoded = this.verify( token );
            } catch ( e ) {
                if ( e.name !== TOKEN_EXPIRED_ERROR_NAME ) throw e;
                decoded = this.decode( token );
            }

            return this.generate(
                this.cleanPayload( decoded )
            );
        },
        /**
         * @param {String} token
         */
        decode: ( token ) => jwt.decode( token )
    },
    refresh: {
        expiresIn: REFRESH_TOKEN_LIFETIME,
        /**
         * @param {Record<string,any>} payload 
         */
        generate: function ( payload ) {
            return jwt.sign(
                payload,
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: this.expiresIn }
            );
        },
        /**
         * @param {Record<string,any>} payload
         */
        cleanPayload: clean,
        /**
         * @param {String} token
         */
        verify: ( token ) => jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        ),
        /**
         * @param {String} token
         */
        refresh: function ( token ) {
            /** @type {object} */
            const decoded = this.verify( token );

            return this.generate(
                this.cleanPayload( decoded )
            );
        },
        /**
         * @param {String} token
         */
        decode: ( token ) => jwt.decode( token )
    },
    resetPassword: {
        expiresIn: RESET_PASSWORD_TOKEN_LIFETIME,
        /**
         * @param {Record<string,any>} payload 
         */
        generate: function ( payload ) {
            return jwt.sign(
                payload,
                process.env.RESET_PASSWORD_SECRET,
                { expiresIn: this.expiresIn }
            );
        },
        /**
         * @param {String} token
         */
        verify: ( token ) => jwt.verify(
            token,
            process.env.RESET_PASSWORD_SECRET
        ),
        /**
         * @param {String} token
         */
        decode: ( token ) => jwt.decode( token )
    },
    verifyUser: {
        expiresIn: VERIFY_USER_TOKEN_LIFETIME,
        /**
         * @param {Record<string,any>} payload 
         */
        generate: function ( payload ) {
            return jwt.sign(
                payload,
                process.env.RESET_PASSWORD_SECRET,
                { expiresIn: this.expiresIn }
            );
        },
        /**
         * @param {String} token
         */
        verify: ( token ) => jwt.verify(
            token,
            process.env.RESET_PASSWORD_SECRET
        ),
        /**
         * @param {String} token
         */
        decode: ( token ) => jwt.decode( token )
    }
};

// -----------------------------------------------------------------------------------------

export {
    tokens
};
