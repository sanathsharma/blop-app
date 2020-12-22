// vendors
import * as yup from 'yup';
import { Op } from 'sequelize';

// common
import { NO_UNKNOWN, validate, sendMessage } from "@ssbdev/common";

// models
import User from "models/user/user.model";

// middlewares
import statusCache from "middleware/statusCache";
import { tokens } from "helpers/generateTokens";

// constants
import { RESET_PASSWORD_CLIENT_URL } from "constants/app.constants";

// mailer
import { transporter } from "mailer";

// errors

// schema
const initiateResetPasswordSchema = {
    body: yup.object().shape( {
        emailId: yup.string().trim().email().required()
    } ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    params: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
    query: yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN ),
};

// -------------------------------------------------------------------------------

export default [
    validate(
        initiateResetPasswordSchema.body,
        initiateResetPasswordSchema.params,
        initiateResetPasswordSchema.query
    ),
    statusCache( "user" ),
    async ( req, res, next ) => {
        const { emailId } = req.validated.body;
        const { USERSTATUS } = req;
        const RES_MSG = "If your email id is right, you will shortly get a mail to reset your password. Thank you...";

        try {
            const user = await User.findOne( {
                where: {
                    emailId,
                    statusId: {
                        [Op.in]: [USERSTATUS.ACTIVE, USERSTATUS.NOT_VERIFIED]
                    }
                }
            } );

            // if user does not exists
            if ( !user ) return sendMessage( res, RES_MSG );

            // if user exists

            // payload
            const payload = { userId: user.id };

            // generate token
            const token = tokens.resetPassword.generate( payload );

            // url
            const URL = `${ RESET_PASSWORD_CLIENT_URL }/${ token }`;

            // drop a mail
            transporter.sendMail( {
                from: process.env.NOREPLY_EMAIL,
                to: emailId,
                subject: "Reset Password",
                html: `
                    <p>You have initiated password reset process.</p>
                    <p>To reset your password 
                        <a href="${ URL }">click here</a>
                    </p>
                    `
            }, ( e, info ) => {
                // if no callback is provided, a promise is return
                // a callback is used to send success response even if error exists
                sendMessage( res, RES_MSG );
            } );

        } catch ( e ) {
            next( e );
        }
    }
];