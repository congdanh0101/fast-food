const express = require('express')
const VoucherController = require('../controller/VoucherController')
const router = express.Router()

router.post('/',VoucherController.createVoucher)
router.get('/:id',VoucherController.getVoucherById)
router.get('/',VoucherController.getAllVoucher)
router.put('/:id',VoucherController.updateVoucherById)
router.delete('/:id',VoucherController.deleteVoucherById)

module.exports = router