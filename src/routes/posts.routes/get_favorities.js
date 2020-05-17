// express
// vendors
import * as yup from 'yup';
import { pick } from 'lodash';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import { sendData } from 'utils/response';
import { NO_UNKNOWN } from 'utils/constants';

// models
import Post from 'models/post/post.model';
import User from 'models/user/user.model';
import UserDp from 'models/user/userDp.model';
import FavoritePost from 'models/favoritePost.model';
import PostStatus from 'models/post/postStatus.model';

// initializations
// validation schema
const getFavoritiesReqBodySchema = yup.object().shape( {} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getFavoritiesReqBodySchema ),
    async ( req, res, next ) => {
        const userId = req.userId;

        try {
            const favoritePosts = await FavoritePost.findAll( {
                where: {
                    addedBy: userId,
                    "$post.status.name$": "active"
                },
                include: [{
                    model: Post,
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
                    ],
                    as: 'post'
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'postId']
                }
            } );

            // send response
            sendData( res, {
                favoritePosts: favoritePosts.map( fav => {
                    return {
                        ...fav.toJSON(),
                        post: pick( fav.post, ['id', 'title', 'createdAt', 'author'] )
                    };
                } )
            } );
        } catch ( e ) {
            next( e );
        }
    }
];