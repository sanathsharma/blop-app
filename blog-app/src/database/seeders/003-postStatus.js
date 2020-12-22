module.exports = {
    up: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkInsert( 'PostStatuses',
            [{
                name: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "inactive",
                createdAt: new Date(),
                updatedAt: new Date()
            }],
            {}
        );
    },
    down: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkDelete( 'PostStatuses',
            null,
            {}
        );
    }
};