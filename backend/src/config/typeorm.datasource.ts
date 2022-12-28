import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    logging: true,
    username: "olimp",
    password: "olimp",
    database: "olimp",
    host: "localhost",
});


AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
