// express
import express from 'express';

// vendors
// middlewares
import { checkAuth } from '@ssbdev/common';

// utils
// api logic
import get_users from './get_users';
import login from './login';
import signup from './signup';
import get_user from './get_user';
import update_user from './update_user';
import deactivate_user from './deactivate_user';
import update_dp from './update_dp';
import delete_dp from './delete_dp';

// initializations
const router = express.Router();

// ---------------------------- routes --------------------------

router.post( '/login', login );
router.post( '/signup', signup );

router.post( '/get_users', checkAuth, get_users );
router.post( "/get_user", checkAuth, get_user );
router.post( "/update_user", checkAuth, update_user );
router.post( "/delete_user", checkAuth, deactivate_user );
router.post( "/update_dp", checkAuth, update_dp );
router.post( "/delete_dp", checkAuth, delete_dp );

// ---------------------------------- change password ----------------------------
// ???????
// smpt -> key(queryParam) -> attack key with api
// key -> jwt -> process.env.CHANGE_PASSWORD_SECRET

// todo: active status & emailId unique

export default router;