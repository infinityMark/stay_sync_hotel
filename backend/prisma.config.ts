// backend/prisma.config.ts
/// <reference types="node" />

export default {
    datasource: {
        url: process.env.DATABASE_URL,
    },
};
