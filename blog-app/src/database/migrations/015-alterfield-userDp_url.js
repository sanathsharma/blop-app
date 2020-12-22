const Sequelize = require( "sequelize" );

/**
 * @link https://sequelize.readthedocs.io/en/latest/docs/migrations/
 */

module.exports = {
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    up: ( queryInterface, { JSON } ) => {
        return queryInterface.changeColumn( 'UserDps', "url", {
            type: JSON,
            allowNull: false
        } );
    },
    down: ( queryInterface ) => {
        return new Promise( ( resolve ) => resolve() );
    }
};