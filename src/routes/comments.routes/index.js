// express
import express from 'express';

// vendors
// middlewares
import { checkAuth } from 'isAuth';

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

router.use( checkAuth );

router.use( "/create_comment", create_comment );
router.use( "/update_comment", update_comment );
router.use( "/delete_comment", deactivate_comment );

export default router;