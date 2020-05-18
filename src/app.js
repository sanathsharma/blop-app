// ------------------------------ imports -----------------------------

import express from 'express';

// middlewares
import morgan from 'morgan'; // HTTP request logger middleware
import compression from 'compression';
import cors from 'cors';

// custom middlewares
import isAuth from './middleware/is-auth';

//routers
import userRoutes from './routes/users.routes';
import postRoutes from './routes/posts.routes';

// ------------------------- create express app ----------------------

export const app = express();

// -------------------------- other middleware -----------------------

app.use( compression() ); // compress response
app.use( morgan( 'dev' ) ); // HTTP request logger middleware
app.use( '/static', express.static( 'media' ) ); // serve media files
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() ); // body parsing

// ----------------------------- set headers --------------------------

app.use( cors( {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
} ) );

app.use( ( req, res, next ) => {
    res.removeHeader( 'X-Powered-By' ); // to not let the client side know about backend technologies
    next();
} );

// ------------------------ jwt auth middleware -----------------------

app.use( isAuth );

// ------------------------------- urls -----------------------------------

app.use( '/api/users', userRoutes );
app.use( '/api/posts', postRoutes );

// ---------- handle errors that make past all the routes -------------

app.use( ( req, res, next ) => {
    const error = new Error( 'Not Found' );
    next( error );
} );

app.use( ( error, req, res, next ) => {
    res
        .status( 200 )
        .json( {
            status: "error",
            message: "Server Error",
            error: {
                type: error.name,
                message: error.message
            }
        } );
} );