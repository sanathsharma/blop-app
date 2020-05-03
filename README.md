https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp

// -------------- model interation --------------
https://sequelize.org/master/class/lib/model.js~Model.html

// --------------- migrations --------------------

https://sequelize.org/master/manual/migrations.html

* ----------------- create model and migration files -------------------
* npx sequelize-cli model:generate --name Test --attributes firstName:string,lastName:string,email:string
* ------- or ----------
* sequelize model:generate --name Test --attributes firstName:string,lastName:string,email:string

* ----------------- running migration ---------------------------
* npx sequelize-cli db:migrate
* ------------ or ---------
* sequelize db:migrate
* ---------- specific -----------
* npx sequelize-cli db:migrate  --from create-user.js --to create-userStatus.js

* ----------------- seed specific -------------
* npx sequelize-cli db:seed  --seed userStatus.js


<!-- ----------- file storage with multer ----------- -->

const storage = multer.diskStorage( {
    destination ( req, file, callback ) {
        callback( null, './media' );
    },
    filename ( req, file, callback ) {
        callback( null, new Date().toISOString() + file.originalname );
    }
} );

const upload = multer( {
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter ( req, file, callback ) {
        if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' )
            callback( null, true );
        else
            callback( new Error( "Incorrect File Format. Accepted file formates are 'jpeg' & 'png' " ), false );
        /*
        * reject a file
        callback( null, false );
        * accept a file
        callback( null, true );
        * throw error for wrong file
        callback( new Error( "Incorrect File Format." ), false );
        */
    }
} );

<!-- ----------------------- multer usage ------------------------ -->

router.post( '/', upload.single( 'image' ), ( req, res, next ) => {
    const file = req.file;
    const filePath = req.file.path
} );

<!-- --------------------- response pattern ----------------------- -->

{
    "status": "error | success",
    "message": "",
    "error": {
        "message": ""
    },
    "data": {}
}

<!-- ---------------------- import order ----------------------- -->

// express
// vendors
// middlewares
// utils
// models
// initializations
