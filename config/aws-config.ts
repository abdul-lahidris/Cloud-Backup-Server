require('dotenv').config();

import AWS from 'aws-sdk';
import config from 'config';

const s3Config = config.get<{
    accesskey: string;
    secretKey: string;
    bucket: string;
}>('S3');
const s3 = new AWS.S3({
    accessKeyId: s3Config.accesskey,
    secretAccessKey: s3Config.secretKey,
});

const s3BucketName = s3Config.bucket;

export { s3, s3BucketName };
