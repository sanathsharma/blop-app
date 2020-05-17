// express
import express from 'express';

// vendors
// middlewares
import { checkAuth } from 'isAuth';

// utils
// models
// apis
import get_posts from './get_posts';
import create_post from './create_post';
import deactivate_post from './deactivate_post';
import update_post from './update_post';
import get_post from './get_post';
import add_to_favorities from './add_to_favorities';
import get_favorities from './get_favorities';
import remove_from_favorities from './remove_from_favorities';

// initializations
const router = express.Router();

// validation schema

// ---------------------------- routes --------------------------

router.post( "/get_posts", get_posts );
router.post( "/get_post", get_post );

router.use( checkAuth );

router.post( "/create_post", create_post );
router.post( "/update_post", update_post );
router.post( "/delete_post", deactivate_post );

router.post( "/get_favorities", get_favorities );
router.post( "/add_to_favorities", add_to_favorities );
router.post( "/remove_from_favorities", remove_from_favorities );

export default router;