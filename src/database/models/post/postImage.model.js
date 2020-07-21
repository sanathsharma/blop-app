import db from 'db';
import * as Sequelize from 'sequelize';
import { deleteMediaFile } from "helpers/deleteMediaFile";

const PostImage = db.define( "PostImage", {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
    {
        hooks: {
            // delete images in storege
            afterDestroy ( instance ) {
                deleteMediaFile( instance.url );
            }
        }
    } );

export default PostImage;