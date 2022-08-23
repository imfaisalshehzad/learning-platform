export default () => ({
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.SERVER_PORT) || 3000,
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'foo',
        password: process.env.DB_PASSWORD || 'foo',
        database: process.env.DB_DATABASE || 'foo',
        entities: [
            `${__dirname}/../**/entities/*.entity.{ts,js}`,
        ],
        synchronize: process.env.DB_SYNCHRONIZE || true,
    },
})
