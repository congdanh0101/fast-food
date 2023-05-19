const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: 'ASIAQCXOIDTEUGNJNLJK',
    secretAccessKey: 'YoxRglqUa8d1DbfzNGxoBy+waJLfKuz7Cp+Ym2Od',
    sessionToken:
        'FwoGZXIvYXdzEGIaDKNQs7evBGl7yJP4ayLOAZryz6z6hK2FX89OgTc1Vpsx1tBiCb0qsi1S0EtrtqiyPbXWj1sjZMKNkCRWWUs4CbINtDGSkh4gjq37nehVVlit1jTAu/LcpT2axxl4ZobB+9huwo6E2nsVtU5uwaqjKs5ic/yLWUOgTxxW8GHl8nCvuDICXBgItJZfqj2xDYFH0Y1yOE9VcM0A1mAZOD/bLLrgkiRbF8ChzjGbp6PdIE6FPrDrB1Zk4Rgdxxq93cV57RJ3/RKqrRNyNqCC6qQGSFsfK+RxFbuM2zEpOaFHKMnCnqMGMi37NjFNSIOKA9J33JI5cMKT0A4QZ8LfCN7MFNX12LG4fCNPGaQXugWEyXhxqS0=',
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
          const validContentTypes = Object.keys(FILE_TYPE_MAP).map(
              (key) => `image/${FILE_TYPE_MAP[key]}`
          )

        const param = {
            Bucket: 'fast-food-api/image',
            Key: `${fileName}-${Date.now()}.${extension}`,
            Body: file.buffer,
            ContentType: validContentTypes,
            ACL: 'public-read',
        }
        s3.upload(param, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

module.exports = uploadImage
