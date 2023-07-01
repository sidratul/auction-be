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
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'username',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auction',
}));
