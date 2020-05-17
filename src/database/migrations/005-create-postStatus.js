module.exports = {
    up: ( queryInterface, { STRING, INTEGER, DATE } ) => {
        return queryInterface.createTable( 'PostStatuses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER
            },
            name: {
                type: STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DATE
            },
            updatedAt: {
                allowNull: false,
                type: DATE
            },
        } );
    },
    down: ( queryInterface, { } ) => {
        return queryInterface.dropTable( 'PostStatuses' );
    }
};