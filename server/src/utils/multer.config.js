const multer = require('multer')
const AWS = require('aws-sdk')
const AWSConfig = AWS.config.loadFromPath('./aws_config.json')
const s3 = new AWS.S3(AWSConfig)


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')
        if (isValid) uploadError = null
        cb(uploadError, 'src/public')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const uploadOptions = multer({ storage: storage })
// const uploadOptions = multer({dest:'src/public'})

module.exports = uploadOptions
