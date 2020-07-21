import SMTPTransport from "nodemailer/lib/smtp-transport";
import { createTransport } from "nodemailer";

/**
 * @type {SMTPTransport['options']}
 */
const transportOptions = {
    secure: true,
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.OAUTH_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTH_ACCESS_TOKEN,
    }
};

const transporter = createTransport( transportOptions );

transporter.on( 'token', token => {
    console.log( 'A new access token was generated' );
    console.log( 'User: %s', token.user );
    console.log( 'Access Token: %s', token.accessToken );
    console.log( 'Expires: %s', new Date( token.expires ) );
} );

transporter.on( 'error', ( e ) => {
    console.log( 'NODEMAILER ERROR:\n', e );
} );

export {
    transportOptions,
    transporter
};