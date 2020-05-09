// ------------------------------ imports -----------------------------
import express from 'express';

// middlewares
import morgan from 'morgan'; // HTTP request logger middleware

// custom middlewares
import isAuth from './middleware/is-auth';

//routers
import userRoutes from './routes/users.routes';

// ------------------------- create express app ----------------------

export const app = express();

// -------------------------- other middleware -----------------------

app.use( morgan( 'dev' ) ); // HTTP request logger middleware
app.use( '/static', express.static( 'media' ) );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// ----------------------------- set headers --------------------------

app.use( ( req, res, next ) => {
    res.setHeader( "Access-Control-Allow-Origin", 'http://localhost:3000' );
    res.setHeader( "Acess-Control-Allow-Methods", "POST, OPTIONS" );
    res.setHeader( "Access-Control-Allow-Headers", "Content-Type, Authorization" );
    if ( req.method === "OPTIONS" ) return res.sendStatus( 200 );
    next();
} );

// ------------------------ jwt auth middleware -----------------------

app.use( isAuth );

// ------------------------------- urls -----------------------------------

app.use( '/api/users', userRoutes );

// ---------- handle errors that make past all the routes -------------

app.use( ( req, res, next ) => {
    const error = new Error( 'Not Found' );
    // @ts-ignore
    error.status = 404;
    next( error );
} );

app.use( ( error, req, res, next ) => {
    res
        .status( error.status || 500 )
        .json( {
            error: {
                message: error.message
            }
        } );
} );