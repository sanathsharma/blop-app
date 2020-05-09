// express
import express from 'express';

// vendors
// middlewares
// utils
// api logic
import get_users from './get_users';
import login from './login';
import signup from './signup';
import get_user from './get_user';
import update_user from './update_user';
import deactivate_user from './deactivate_user';
import delete_user from './delete_user';
import update_dp from './update_dp';
import delete_dp from './delete_dp';

// initializations
const router = express.Router();

// urls

router.post( '/get_users', ...get_users() );
router.post( '/login', ...login() );
router.post( '/signup', ...signup() );
router.post( "/get_user", ...get_user() );
router.post( "/update_user", ...update_user() );
router.post( "/deactivate_user", ...deactivate_user() );
router.post( "/delete_user", ...delete_user() );
router.post( "/update_dp", ...update_dp() );
router.post( "/delete_dp", ...delete_dp() );

// ---------------------------------- change password ----------------------------
// ???????
// smpt -> key(queryParam) -> attack key with api
// key -> jwt -> process.env.CHANGE_PASSWORD_SECRET

// todo: 
// active status & emailId unique

export default router;