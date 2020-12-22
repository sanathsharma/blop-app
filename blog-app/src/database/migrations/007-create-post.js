module.exports = {
    up: ( queryInterface, { STRING, INTEGER, DATE, TEXT } ) => {
        return queryInterface.createTable( 'Posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER
            },
            title: {
                type: STRING,
                allowNull: false
            },
            description: {
                type: TEXT,
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
            imageId: {
                allowNull: true,
                type: INTEGER,
                references: {
                    model: "PostImages",
                    key: "id"
                },
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },
            addedBy: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: "Users",
                    key: "id"
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },
            statusId: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: "PostStatuses",
                    key: "id"
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },
            categoryId: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: "Catogories",
                    key: "id"
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        } );
    },
    down: ( queryInterface, { } ) => {
        return queryInterface.dropTable( 'Posts' );
    }
};