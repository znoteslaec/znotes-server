// utils/gcsConfig.js



const { Storage } = require('@google-cloud/storage');


const gcs = new Storage({
    credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
});

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = gcs.bucket(bucketName);

module.exports = bucket;





// *-----------------------------------------
// * Google cloud storage with json key file
// *-----------------------------------------


// const { Storage } = require('@google-cloud/storage');
// const path = require('path');

// const gcs = new Storage({
//     projectId: process.env.GCS_PROJECT_ID,
//     keyFilename: path.join(__dirname, '..', process.env.GCS_KEYFILE_PATH),
// });
// const bucketName = process.env.GCS_BUCKET_NAME;
// const bucket = gcs.bucket(bucketName);

// module.exports = bucket;

