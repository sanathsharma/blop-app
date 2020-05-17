module.exports = {
    up: ( queryInterface, { STRING, INTEGER, DATE } ) => {
        return queryInterface.createTable( 'CommentStatuses', {
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
        return queryInterface.dropTable( 'CommentStatuses' );
    }
};