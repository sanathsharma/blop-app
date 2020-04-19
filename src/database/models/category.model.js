import db from 'db';
import * as Sequelize from 'sequelize';

const Category = db.define( "Category", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
} );

export default Category;