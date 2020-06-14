import { Sequelize } from 'sequelize';
import config from 'db-config';

export default process.env.NODE_ENV === "test"
    ? new Sequelize( config.dialect, { logging: false } )
    : new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            //@ts-ignore
            dialect: config.dialect,
            port: parseInt( config.port ),
            dialectOptions: {
                /**@link https://node-postgres.com/features/ssl */
                // ssl: {
                //     require: true,
                //     rejectUnauthorized: false
                // }
            },
            ssl: true,
            logging: false
        }
    );