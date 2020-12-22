module.exports = {
    up: ( queryInterface, { JSON, INTEGER, DATE } ) => {
        return queryInterface.createTable( 'UserDps', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER
            },
            url: {
                type: JSON,
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
        return queryInterface.dropTable( 'UserDps' );
    }
};