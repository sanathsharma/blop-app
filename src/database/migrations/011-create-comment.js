module.exports = {
    up: ( queryInterface, { STRING, INTEGER, DATE } ) => {
        return queryInterface.createTable( 'Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER
            },
            description: {
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
            postId: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: "Posts",
                    key: "id"
                },
                onDelete: "CASCADE",
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
            parentId: {
                allowNull: true,
                type: INTEGER,
                references: {
                    model: "Comments",
                    key: "id"
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },
            statusId: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: "CommentStatuses",
                    key: "id"
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        } );
    },
    down: ( queryInterface, { } ) => {
        return queryInterface.dropTable( 'Comments' );
    }
};