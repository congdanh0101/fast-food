const multer = require('multer')
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')
        if (isValid) uploadError = null
        cb(uploadError, isValid)
    },
})

module.exports = upload
