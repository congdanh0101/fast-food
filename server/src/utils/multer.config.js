const multer = require('multer')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
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

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype]
//         let uploadError = new Error('Invalid image type')
//         if (isValid) uploadError = null
//         cb(uploadError, 'src/public')
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-')
//         const extension = FILE_TYPE_MAP[file.mimetype]
//         cb(null, `${fileName}-${Date.now()}.${extension}`)
//     },
// })

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'fast-food-api',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         acl: 'public-read',
//         key: function (req, file, cb) {
//             console.log(file)
//             const fileName = file.originalname.split(' ').join('-')
//             cb(null, `image/${fileName}`)
//         },
//     }),
// })

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')
        if (isValid) uploadError = null
        cb(uploadError, isValid)
    },
})

// const uploadOptions = multer({ storage: storage })
// const upload = multer({storage:storage})
// const uploadOptions = multer({dest:'src/public'})

module.exports = upload
