const Sequelize = require( "sequelize" );

/**
 * @link https://sequelize.readthedocs.io/en/latest/docs/migrations/
 */

module.exports = {
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    up: ( queryInterface, { TEXT } ) => {
        return queryInterface.changeColumn( 'Posts', "description", {
            type: TEXT,
            allowNull: false
        } );
    },
    down: ( queryInterface ) => {
        return new Promise( ( resolve ) => resolve() );
    }
};