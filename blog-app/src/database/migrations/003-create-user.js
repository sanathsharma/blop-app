const Sequelize = require( "sequelize" );

/**
 * @link https://sequelize.readthedocs.io/en/latest/docs/migrations/
 */

module.exports = {
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    up: ( queryInterface, { STRING, INTEGER, DATE } ) => {
        return queryInterface.createTable( 'Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER
            },
            emailId: {
                allowNull: false,
                type: STRING
            },
            password: {
                allowNull: false,
                type: STRING
            },
            firstName: {
                allowNull: false,
                type: STRING
            },
            lastName: {
                allowNull: true,
                type: STRING
            },
            bio: {
                allowNull: true,
                type: STRING
            },
            createdAt: {
                allowNull: false,
                type: DATE
            },
            updatedAt: {
                allowNull: false,
                type: DATE
            },
            statusId: {
                allowNull: false,
                references: {
                    model: "UserStatuses",
                    key: "id"
                },
                type: INTEGER,
                onDelete: "CASCADE"
            },
            dpId: {
                allowNull: true,
                type: INTEGER,
                references: {
                    model: "UserDps",
                    key: "id"
                },
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            }
        } );
    },
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    down: ( queryInterface, Sequelize ) => {
        return queryInterface.dropTable( 'Users' );
    }
};