const createHttpError = require('http-errors')
const VoucherService = require('../service/VoucherService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')

class VoucherController {
    async createVoucher(req, res, next) {
        const data = req.body
        const voucher = {
            code: data.code,
            // description: data.description,
            minOrder: data.minOrder,
            maxDiscount: data.maxDiscount,
            discount: data.discount,
        }
        try {
            const result = await VoucherService.createVoucher(voucher)
            return res.status(201).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getAllVoucher(req, res, next) {
        let filter = {}
        const query = req.query
        console.error(query)
        const listVoucher = await VoucherService.getAllVoucher(filter)
        if (!listVoucher) return next(createHttpError.InternalServerError())
        return res.json(listVoucher)
    }

    async getVoucherById(req, res, next) {
        const id = req.params.id
        const voucher = await VoucherService.getVoucherById(id)
        if (!voucher)
            return next(new ResourceNotFoundException('Voucher', 'id', id))
        return res.json(voucher)
    }

    async updateVoucherById(req, res, next) {
        const id = req.params.id
    }

    async deleteVoucherById(req, res, next) {
        const id = req.params.id
    }

    async useVoucher(req, res, next) {
        const data = req.body
        const using = {
            code: data.code,
            value: data.value,
        }

        try {
            const result = await VoucherService.useVoucher(using)
            return res.json({ discount: result })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new VoucherController()
