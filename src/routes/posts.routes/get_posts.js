// express
// vendors
import * as yup from 'yup';
import { pick } from 'lodash';

// middlewares
import validate from "middleware/validate-req-body";

// utils
import { NO_UNKNOWN } from "utils/constants";
import { sendData } from "utils/response";

// models
import Post from "models/post/post.model";
import PostStatus from "models/post/postStatus.model";
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

// initializations
// validation schema
const getPostsReqBodySchema = yup.object().shape( {
    categoryId: yup.number().positive().integer().notRequired(),
    userId: yup.number().positive().integer().notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// todo: getter function for truncated description
export default [
    validate( getPostsReqBodySchema ),
    async ( req, res, next ) => {
        const { categoryId, userId } = req.validatedBody;

        const where = {
            "$status.name$": "active"
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
                        model: PostStatus,
                        attributes: ["name"],
                        as: "status"
                    },
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