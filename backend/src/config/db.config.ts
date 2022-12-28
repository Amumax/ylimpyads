import {registerAs} from "@nestjs/config";
import { join } from 'path';

export default registerAs('database', () => {
    return {
        type: "postgres",
        logging: true,
        username: "olimp",
        password: "olimp",
        database: "olimp",
        entities: [join(__dirname, '**', '*.entity.{ts, js}')],
        migrations: ['src/migrations/*{.ts,.js}'],
        synchronize: true,
        logger: "advanced-console",
        autoLoadEntities: true,
        // synchronize: process.env.MODE === "dev",
        cli: {
            migrationsDir: 'src/migrations'
        },
    }
})