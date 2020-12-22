module.exports = {
    up: ( queryInterface, Sequelize ) => {
        return queryInterface.bulkInsert( 'CommentStatuses',
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
        return queryInterface.bulkDelete( 'CommentStatuses',
            null,
            {}
        );
    }
};