require('dotenv').config();
const AWS = require('aws-sdk');

exports.uploadToS3 = (file) => {
    const BUCKET_NAME = 'groupchat-demo';
    const AWS_REGION = 'ap-south-1'

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: AWS_REGION
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: `${file.originalname}/${new Date()}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err)
            } else {
                resolve(response.Location)
            }
        })
    })
}

//mumbai is selected
