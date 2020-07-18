// express
// vendors
import * as yup from 'yup';
import { pick } from 'lodash';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import Post from "models/post/post.model";
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

// common
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// initializations
// validation schema
const getPostsReqBodySchema = yup.object().shape( {
    categoryId: yup.number().positive().integer().notRequired(),
    userId: yup.number().positive().integer().notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// todo: getter function for truncated description
export default [
    validate( getPostsReqBodySchema ),
    statusCache( "post" ),
    async ( req, res, next ) => {
        const { categoryId, userId } = req.validated.body;
        const { POSTSTATUS } = req;

        const where = {
            statusId: POSTSTATUS.ACTIVE
        };

        if ( categoryId ) where.categoryId = categoryId;
        else if ( userId ) where.addedBy = userId;
        else if ( req.isAuth && req.userId ) where.addedBy = req.userId;

        try {
            const posts = await Post.findAll( {
                where,
                attributes: ["id", "title", "createdAt"],
                include: [
                    {
                        model: User,
                        attributes: ["id", "firstName", "lastName"],
                        include: [
                            {
                                model: UserDp,
                                attributes: ["url"],
                                as: "dp"
                            }
                        ],
                        as: "author"
                    }
                ]
            } );

            // send posts
            sendData( res, {
                posts: posts.map( post => pick( post, ['id', 'title', 'createdAt', 'author'] ) )
            } );

        } catch ( e ) {
            next( e );
        }
    }
];