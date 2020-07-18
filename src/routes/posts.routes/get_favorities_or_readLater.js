// express
// vendors
import * as yup from 'yup';
import { pick } from 'lodash';

// middlewares
// utils
// models
import Post from 'models/post/post.model';
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';
import FavoritePost from 'models/favoritePost.model';
import ReadLaterPost from 'models/readLaterPost.model';

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';
import statusCache from 'middleware/statusCache';

// initializations
// validation schema
const reqBodySchema = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default ( isFavorities = false ) => [
    validate( reqBodySchema ),
    statusCache( "post" ),
    async ( req, res, next ) => {
        const modal = isFavorities ? FavoritePost : ReadLaterPost;

        const { POSTSTATUS } = req;
        const { userId } = req.auth;

        try {
            const instances = await modal.findAll( {
                where: {
                    addedBy: userId,
                    "$post.statusId$": POSTSTATUS.ACTIVE
                },
                include: [{
                    model: Post,
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
                    ],
                    as: 'post'
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'postId']
                }
            } );

            // send response
            sendData( res, {
                [isFavorities ? "favoritePosts" : "readLaterPosts"]: instances.map( instance => {
                    return {
                        ...instance.toJSON(),
                        post: pick( instance.post, ['id', 'title', 'createdAt', 'author'] )
                    };
                } )
            } );

        } catch ( e ) {
            next( e );
        }
    }
];