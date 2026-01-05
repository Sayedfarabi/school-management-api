export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 5000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
  },
});
