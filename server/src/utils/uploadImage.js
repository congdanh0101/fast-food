const AWS = require('aws-sdk')
require('dotenv').config()
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: 'us-east-1',
})
const s3 = new AWS.S3()

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]

        const param = {
            Bucket: 'fast-food-api/image',
            Key: `${fileName}-${Date.now()}.${extension}`,
            Body: file.buffer,
            ContentType: 'image/png' || 'image/jpg' || 'image/jpeg',
            ACL: 'public-read',
        }
        s3.upload(param, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

module.exports = uploadImage
