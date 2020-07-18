const Sequelize = require( "sequelize" );

/**
 * @link https://sequelize.readthedocs.io/en/latest/docs/migrations/
 */

const CONSTRAINT_NAME = "favoritePosts_postId_addedBy";

module.exports = {
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    up: ( queryInterface, _sequelize ) => {
        return queryInterface.addConstraint( 'FavoritePosts', ["postId", "addedBy"], {
            name: CONSTRAINT_NAME,
            type: "unique"
        } );
    },
    /**
     * @param {Sequelize.QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     */
    down: ( queryInterface, _sequelize ) => {
        return queryInterface.removeConstraint( 'FavoritePosts', CONSTRAINT_NAME );
    }
};