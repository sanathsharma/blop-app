// express
// vendors
import * as yup from 'yup';

// middlewares
// utils
import { NO_UNKNOWN } from 'utils/constants';
import validate from 'middleware/validate-req-body';
import Post from 'models/post/post.model';
import PostImage from 'models/post/postImage.model';
import PostStatus from 'models/post/postStatus.model';
import User from 'models/user/user.model';
import { sendData } from 'utils/response';
import UserDp from 'models/user/userDp.model';

// models
// initializations
// validation schema
const getPostReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getPostReqBodySchema ),
    async ( req, res, next ) => {
        const { postId } = req.validatedBody;

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    "$status.name$": "active"
                },
                include: [
                    {
                        model: PostImage,
                        attributes: ['url'],
                        as: "image"
                    },
                    {
                        model: PostStatus,
                        attributes: ['name'],
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
                attributes: {
                    exclude: ['updatedAt', "statusId", "imageId", "addedBy"]
                }
            } );

            const { status, ...rest } = post.toJSON();
            // send response
            sendData( res, {
                post: rest
            } );

        } catch ( e ) {
            next( e );
        }
    }
];