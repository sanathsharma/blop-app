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
import refresh_tokens from './refresh_tokens';
import logout from "./logout";
import initiate_reset_password from "./initiate_reset_password";
import reset_password from "./reset_password";
import verify_user from "./verify_user";
import d3 from "./d3";

// initializations
const router = express.Router();

// ---------------------------- routes --------------------------

router.post( '/login', login );
router.post( '/d3', d3 );
router.post( '/signup', signup );
router.post( "/refresh", refresh_tokens );
router.post( "/logout", logout );
router.post( "/initiate_reset_password", initiate_reset_password );
router.post( "/reset_password", reset_password );
router.post( "/verify_user", verify_user );

router.post( "/get_user", checkAuth, get_user );
router.post( '/get_users', checkAuth, get_users );
router.post( "/update_user", checkAuth, update_user );
router.post( "/delete_user", checkAuth, deactivate_user );
router.post( "/update_dp", checkAuth, update_dp );
router.post( "/delete_dp", checkAuth, delete_dp );

// ---------------------------------------------------------------

export default router;