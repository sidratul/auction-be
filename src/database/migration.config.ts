import 'dotenv/config';
import { DataSource } from 'typeorm';

const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'username',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auction',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
  logging: false,
  synchronize: false,
});

export default config;
