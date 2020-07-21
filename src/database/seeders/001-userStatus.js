module.exports = {
    up: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkInsert( 'UserStatuses',
            [{
                name: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "inactive",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "not_verified",
                createdAt: new Date(),
                updatedAt: new Date()
            }],
            {}
        );
    },
    down: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkDelete( 'UserStatuses',
            null,
            {}
        );
    }
};