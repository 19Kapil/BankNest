import { DataSource, DataSourceOptions } from "typeorm";
import { config } from 'dotenv';
config();

export const dataSourceOptions:DataSourceOptions ={
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    //synchronize: true,
    synchronize: false,
    logging: true,
    entities: ['dist/**/*.entity{.js,.ts}'],
    migrations: ['dist/migrations/*{.js,.ts}'],
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource