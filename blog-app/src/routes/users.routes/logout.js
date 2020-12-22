// TODO: revoke the refresh token and accesstoken
// have token version on refresh token. 
// increment the token veriosn on logout
// refresh only if the token version matches
// store the current veriosn in db??

import { sendMessage } from "@ssbdev/common";

export default [
    ( req, res, next ) => {
        req.session = null;
        sendMessage( res, "Successfully loged out..." );
    }
];