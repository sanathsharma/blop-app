// express
// vendors
import * as yup from 'yup';

// middlewares
import statusCache from 'middleware/statusCache';

// utils
// models
import Post from 'models/post/post.model';
import User from 'models/user/user.model';
import Comment from 'models/comment.model';
import UserDp from 'models/user/userDp.model';
import PostImage from 'models/post/postImage.model';

// common lib
import { NO_UNKNOWN, validate, sendData } from '@ssbdev/common';

// errors
import { NotFoundError } from "errors/not-found-error";

// initializations
// validation schema
const getPostReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getPostReqBodySchema ),
    statusCache( "post" ),
    statusCache( "comment" ),
    async ( req, res, next ) => {
        const { postId } = req.validated.body;
        const { POSTSTATUS, COMMENTSTATUS } = req;

        try {
            const post = await Post.findOne( {
                where: {
                    id: postId,
                    statusId: POSTSTATUS.ACTIVE
                },
                include: [
                    {
                        model: PostImage,
                        attributes: ['url'],
                        as: "image"
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
                            // "$status.name$": "active", // todo: inactive commenst also queried, fix
                            statusId: COMMENTSTATUS.ACTIVE
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
                        }]
                    }
                ],
                attributes: {
                    exclude: ['updatedAt', "statusId", "imageId", "addedBy"]
                }
            } );

            if ( !post ) throw new NotFoundError( "Post not found" );

            // send response
            sendData( res, {
                post: post.toJSON()
            } );

        } catch ( e ) {
            next( e );
        }
    }
];