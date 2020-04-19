import { Sequelize } from 'sequelize';
import config from 'db-config';

export default new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'postgres',
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