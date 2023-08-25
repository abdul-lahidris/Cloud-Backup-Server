import * as AWS from 'aws-sdk';
import archiver from 'archiver';
import stream from 'stream';
import path from 'path';
import config from 'config';

// Set up AWS S3 client
const s3Config = config.get<{
    accesskey: string;
    secretKey: string;
    bucket: string;
}>('S3');
const s3: AWS.S3 = new AWS.S3({
    accessKeyId: s3Config.accesskey,
    secretAccessKey: s3Config.secretKey,
    httpOptions: {
        timeout: 60 * 30 * 1000, // 30 minutes
    },
});

// Constants
const SOURCE_BUCKET_NAME: string = s3Config.bucket;
const TARGET_BUCKET_NAME: string = s3Config.bucket;
let ARCHIVE_KEY: string = 'archive.zip';



// Create a passthrough stream for uploading
let passthrough: stream.PassThrough | null = null;


// Main function
export const CompressFiles = async function (objectKeys: string[], name: string, destination: string): Promise<string> {
  try {

    passthrough = new stream.PassThrough(); // Create a new passthrough stream

    // Create archival stream
    const archiveStream: archiver.Archiver = archiver('zip');
    archiveStream.on('error', (error: Error) => {
    console.error('Archival encountered an error:', error);
    throw new Error(error.message);
    });

    // Pipe the archive stream into the passthrough stream
    archiveStream.pipe(passthrough);

    console.log("--> starting archive", objectKeys)

    // add objects to stream
    for (const key of objectKeys) {

        const params: AWS.S3.GetObjectRequest = { Bucket: SOURCE_BUCKET_NAME, Key: key };
        const response: AWS.S3.GetObjectOutput = await s3.getObject(params).promise();
        archiveStream.append(response.Body as Buffer, { name: path.basename(key) });
      }

    archiveStream.finalize();
    ARCHIVE_KEY = name ? `${destination}/${Date.now()}_${name}.zip` : `${destination}/${Date.now()}_Archive.zip`;
    console.log("--> uploading archive stream");

    // Upload task promise
    const uploadTask: Promise<[string, string]> = new Promise((resolve) => {
        s3.upload(
        {
            Bucket: TARGET_BUCKET_NAME,
            Key: ARCHIVE_KEY,
            Body: passthrough!,
            ContentType: 'application/zip',
        },
        () => {
            console.log('Zip uploaded.');
            resolve([TARGET_BUCKET_NAME, ARCHIVE_KEY]);
        }
        );
    });
  
    const [BUCKET_NAME, OBJECT_KEY] = await uploadTask;
    // const params: AWS.S3.PresignedUrlRequest = {
    //   Bucket: BUCKET_NAME,
    //   Key: OBJECT_KEY,
    //   Expires: 60 * 60 * 24, // 24 hours
    // };
    // const url: string = await s3.getSignedUrlPromise('getObject', params);
    // console.log('Presigned URL:', url);
    console.log('Presigned URL:', OBJECT_KEY);
    return ARCHIVE_KEY;
  } catch (error) {
    console.error('An error occurred:', error);
    return '';
  }
}
// // Example list of object keys
// const objectKeys: string[] = ['key1', 'key2', 'key3'];

// // Call the main function with the object keys
// main(objectKeys);
