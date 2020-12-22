// express
import express from 'express';

// vendors
// middlewares

// common lib
import { checkAuth } from '@ssbdev/common';

// utils
// models
// apis
import get_comments from './get_comments';
import create_comment from './create_comment';
import update_comment from './update_comment';
import deactivate_comment from './deactivate_comment';

// initializations
const router = express.Router();

// validation schema


// -------------------------------- routes ----------------------------------

router.use( "/get_comments", get_comments );

router.use( "/create_comment", checkAuth, create_comment );
router.use( "/update_comment", checkAuth, update_comment );
router.use( "/delete_comment", checkAuth, deactivate_comment );

export default router;