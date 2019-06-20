import { createConnection } from "typeorm";

export async function createTypeormConn() {
  return await createConnection({
    name: "default",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "bot",
    synchronize: true,
    entities: ["src/entity/**.ts"],
    logging: true,
    cache: true,
  });
}
