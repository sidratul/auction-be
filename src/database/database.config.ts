import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  keepConnectionAlive: true,
  synchronize: false,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}));
