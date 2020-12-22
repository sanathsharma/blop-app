const { hashSync } = require( 'bcryptjs' );

module.exports = {
    up: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkInsert( 'Users', [
            {
                emailId: "test@g.com",
                password: hashSync( "awsedrft", 12 ),
                firstName: "test",
                lastName: "test",
                bio: "test bio",
                createdAt: new Date(),
                updatedAt: new Date(),
                statusId: 1,
                dpId: null
            },
            {
                emailId: "test2@g.com",
                password: hashSync( "awsedrft", 12 ),
                firstName: "test2",
                lastName: "test2",
                bio: "test2 bio",
                createdAt: new Date(),
                updatedAt: new Date(),
                statusId: 2,
                dpId: null
            }
        ],
            {}
        );
    },
    down: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkDelete( 'Users', null, {} );
    }
};
