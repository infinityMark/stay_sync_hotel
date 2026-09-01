import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// 加载 backend 根目录下的 .env
dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
