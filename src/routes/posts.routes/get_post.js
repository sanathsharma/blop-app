// express
// vendors
import * as yup from 'yup';

// middlewares
import validate from 'middleware/validate-req-body';

// utils
import exclude from 'utils/exclude';
import message from 'utils/message';
import { NO_UNKNOWN } from 'utils/constants';
import { sendData, sendError } from 'utils/response';

// models
import Post from 'models/post/post.model';
import User from 'models/user/user.model';
import Comment from 'models/comment.model';
import UserDp from 'models/user/userDp.model';
import PostImage from 'models/post/postImage.model';
import PostStatus from 'models/post/postStatus.model';
import CommentStatus from 'models/commentStatus.model';

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
                    },
                    {
                        model: Comment,
                        where: {
                            "$status.name$": "active", // todo: inactive commenst also queried, fix
                            // statusId: 1
                        },
                        /**
                         * eager loading
                         * @link https://sequelize.org/master/manual/eager-loading.html
                         * if no comments are there, then the query return no post even if post exists,
                         * when required is made "false", it returns the post with comments -> empty array
                         */
                        required: false,
                        attributes: ["id", "description", "createdAt", "postId"],
                        as: "comments",
                        include: [{
                            model: User,
                            attributes: ["id", "firstName", "lastName"],
                            include: [
                                {
                                    model: UserDp,
                                    attributes: ["url"],
                                    as: "dp"
                                }
                            ],
                            as: "commentedBy"
                        }, {
                            model: CommentStatus,
                            attributes: ['name'],
                            as: "status"
                        }]
                    }
                ],
                attributes: {
                    exclude: ['updatedAt', "statusId", "imageId", "addedBy"]
                }
            } );

            if ( !post ) return sendError( res,
                message( "Could not get post", "Post not found" ),
                message( "Could not get post", "Post not found" )
            );

            const { status, ...rest } = post.toJSON();
            // send response
            sendData( res, {
                post: {
                    ...rest,
                    comments: rest.comments.map( comment => exclude( comment, ['status'] ) )
                }
            } );

        } catch ( e ) {
            next( e );
        }
    }
];