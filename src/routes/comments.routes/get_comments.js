// express
// vendors
import * as yup from 'yup';

// common lib
import { NO_UNKNOWN, validate, sendData, exclude } from '@ssbdev/common';

// models
import User from 'models/user/user.model';
import Comment from 'models/comment.model';
import UserDp from 'models/user/userDp.model';
import CommentStatus from 'models/commentStatus.model';

// initializations
// validation schema
const getCommentsReqBodySchema = yup.object().shape( {
    postId: yup.number().positive().integer().required( "postId is required" ),
    parent: yup.number().positive().integer().nullable( true ).notRequired()
} ).strict( true ).noUnknown( true, NO_UNKNOWN );

export default [
    validate( getCommentsReqBodySchema ),
    async ( req, res, next ) => {
        const { postId, parent } = req.validated.body;

        const where = {
            postId,
            "$status.name$": "active"
        };

        /**
         * if parent is null -> query only toplevel comments,
         * if undefined -> query all,
         * if id -> query nested comments
         */
        if ( parent !== undefined ) where.parentId = parent;

        try {
            const comments = await Comment.findAll( {
                where,
                attributes: {
                    exclude: ['statusId', 'addedBy']
                },
                include: [
                    {
                        model: CommentStatus,
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
                        as: "commentedBy"
                    },
                ]
            } );

            //send response
            sendData( res, {
                comments: comments.map( comment => exclude( comment.toJSON(), ['status'] ) )
            } );

        } catch ( e ) {
            next( e );
        }
    }
];