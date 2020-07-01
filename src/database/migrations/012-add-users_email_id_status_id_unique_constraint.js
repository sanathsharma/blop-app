const Sequelize = require( "sequelize" );

/**
 * @link https://sequelize.readthedocs.io/en/latest/docs/migrations/
 */

const CONSTRAINT_NAME = "users_status_id_email_id";

module.exports = {
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    up: ( queryInterface, _sequelize ) => {
        return queryInterface.addConstraint( 'Users', ["statusId", "emailId"], {
            name: CONSTRAINT_NAME,
            type: "unique"
        } );
    },
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    down: ( queryInterface, _sequelize ) => {
        return queryInterface.removeConstraint( 'Users', CONSTRAINT_NAME );
    }
};