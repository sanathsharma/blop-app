// ------------------------------ imports -----------------------------

import express from 'express';

// middlewares
import morgan from 'morgan'; // HTTP request logger middleware
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieSession from 'cookie-session';

// common
import { errorHandler, isAuth } from '@ssbdev/common';

// routers
import userRoutes from './routes/users.routes';
import postRoutes from './routes/posts.routes';
import commentRoutes from './routes/comments.routes';

// errors
import { PathNotFoundError } from "errors/path-not-found-error";

// ------------------------- create express app ----------------------

export const app = express();

// -------------------------- other middleware -----------------------

app.use( compression( { threshold: 0 } ) ); // compress response
if ( process.env.NODE_ENV !== "test" ) app.use( morgan( 'dev' ) ); // HTTP request logger middleware
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() ); // body parsing

// ----------------------------- set headers --------------------------

app.use( cors( {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
} ) );
// 'Origin', 'X-Requested-With', 'Accept'

app.use( helmet() );

// -------------------------------- cookies -----------------------------

// app.set('trust proxy', 1);
app.use( cookieSession( {
    secret: process.env.COOKIE_SECRET,
    keys: ["fghjk", "fghjkl"],
    domain: "localhost",
    name: "session",
    /**
     * attach the cookie in the request header only if document.location starts with this
     */
    path: "/",
    /**
     * not accessible in browser
     */
    httpOnly: true,
    /**
     * only on https, except for test environment
     */
    secure: false, // process.env.NODE_ENV !== "test"
    expires: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 ) // 7days, lifetime of refresh token
} ) );

// ------------------------ jwt auth middleware -----------------------

app.use( isAuth( {
    tokenIn: "Authorization"
} ) );

// ----------------- initialize validatedBody & params ----------------

app.use( ( req, res, next ) => {
    req.validated = {
        body: {},
        params: {},
        query: {}
    };
    next();
} );

// ------------------------- serving static files ------------------------

/** have public, private saperate folders and perform checkAuth,
 *  for private if authentication is needed for access 
 */
app.use( '/static', express.static( 'media' ) ); // serve media files

// ------------------------------- urls -----------------------------------

app.use( '/api/users', userRoutes );
app.use( '/api/posts', postRoutes );
app.use( '/api/comments', commentRoutes );

// ---------- handle errors that make past all the routes -------------

app.use( ( req, res, next ) => next( new PathNotFoundError() ) );

// ----------------- error handling middleware ---------- --------------

app.use( errorHandler( {} ) );