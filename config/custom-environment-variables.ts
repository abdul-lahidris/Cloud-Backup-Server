export default {
  port: 'PORT',
  postgresConfig: {
    host: 'POSTGRES_HOST',
    port: 'POSTGRES_PORT',
    username: 'POSTGRES_USER',
    password: 'POSTGRES_PASSWORD',
    database: 'POSTGRES_DB',
  },
  prodPostgresConfig: {
    url: 'POSTGRES_URL',
    port: 'POSTGRES_PORT',
    username: 'POSTGRES_USER',
    password: 'POSTGRES_PASSWORD',
    database: 'POSTGRES_DB',
  },
  postgresConfigTest: {
    host: 'POSTGRES_HOST',
    port: 'POSTGRES_PORT',
    username: 'POSTGRES_USER',
    password: 'POSTGRES_PASSWORD',
    database: 'POSTGRES_DB_TEST',
  },

  accessTokenPrivateKey: 'JWT_ACCESS_TOKEN_PRIVATE_KEY',
  accessTokenPublicKey: 'JWT_ACCESS_TOKEN_PUBLIC_KEY',
  refreshTokenPrivateKey: 'JWT_REFRESH_TOKEN_PRIVATE_KEY',
  refreshTokenPublicKey: 'JWT_REFRESH_TOKEN_PUBLIC_KEY',

  smtp: {
    host: 'EMAIL_HOST',
    pass: 'EMAIL_PASS',
    port: 'EMAIL_PORT',
    user: 'EMAIL_USER',
  },

  S3: {
    accesskey: 'AWS_ACCESS_KEY_ID',
    secretKey: 'AWS_SECRET_ACCESS_KEY',
    bucket:'AWS_BUCKET_NAME'
  },
  fileApproval: {
    threshold:"FILE_DELETE_APPROVAL_COUNT"
  },
  redis: {
    redisUrl:"REDIS_URL"
  }
};
