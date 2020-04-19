import http from 'http';
import { app } from './app';
import db from 'db';

const port = process.env.PORT || 5555;

const server = http.createServer( app );

server.listen( { port }, () => {
    console.log( `🚀 Server is up at http://localhost:${ port }` );
    db.authenticate()
        .then( () => {
            console.log( 'successfully connected to posrgres...' );
        } )
        .catch( ( e ) => {
            console.log( 'error while conneting to posrgres', e );
        } );
} );
