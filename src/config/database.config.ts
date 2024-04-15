import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";
export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [join(__dirname, "../entities/**/*.entity{.ts,.js}")],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  ssl: false,
};
