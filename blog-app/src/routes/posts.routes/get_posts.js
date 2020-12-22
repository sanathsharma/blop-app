// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import Post from "models/post/post.model";
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';

// common
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// ------------------------------------------------------------------------------------------

// initializations
// validation schema
const getPostsReqBodySchema = yup.object().shape( {
    categoryId: yup.number().positive().integer().notRequired(),
    userId: yup.number().positive().integer().notRequired(),
    all: yup.boolean().notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

// ------------------------------------------------------------------------------------------

// helpers
class AuthorFactory {
    constructor( author ) {
        this.id = author.id;
        this.dpUrl = author.dp?.url ?? null;
        this.fullName = author.fullName;
        this.emailId = author.emailId;
    }
}

class PostFactory {
    constructor( post ) {
        this.id = post.id;
        this.title = post.title;
        this.createdAt = post.createdAt;
        this.author = new AuthorFactory( post.author );
        this.shortDescription = post.shortDescription;
        this.description = post.description;
    }
}

// ------------------------------------------------------------------------------------------

export default [
    validate( getPostsReqBodySchema ),
    statusCache( "post" ),
    async ( req, res, next ) => {
        const { categoryId, userId, all } = req.validated.body;
        const { POSTSTATUS } = req;

        const where = {
            statusId: POSTSTATUS.ACTIVE
        };

        if ( !all )
            if ( categoryId ) where.categoryId = categoryId;
            else if ( userId ) where.addedBy = userId;
            else if ( req.isAuth && req.userId ) where.addedBy = req.userId;

        try {
            const posts = await Post.findAll( {
                where,
                attributes: ["id", "title", "createdAt", "description"],
                order: [
                    ["createdAt", "DESC"]
                ],
                include: [
                    {
                        model: User,
                        attributes: ["id", "fullName", "emailId", "firstName", "lastName"],
                        include: [
                            {
                                model: UserDp,
                                attributes: ["url"],
                                as: "dp",
                            }
                        ],
                        as: "author"
                    }
                ]
            } );

            // send posts
            sendData( res, {
                posts: posts.map( post => new PostFactory( post ) )
            } );

        } catch ( e ) {
            next( e );
        }
    }
];