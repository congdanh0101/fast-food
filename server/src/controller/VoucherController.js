const createHttpError = require('http-errors')
const VoucherService = require('../service/VoucherService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')

class VoucherController {
    async createVoucher(req, res, next) {
        const data = req.body
        const voucher = {
            description: data.description,
            minDiscount: data.minDiscount,
            maxDiscount: data.maxDiscount,
            discount: data.discount,
            type: data.type,
        }
        const result = await VoucherService.createVoucher(voucher)
        if (!result) return next(createHttpError.InternalServerError())
        return res.json(result)
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

    async updateVoucherById(req,res,next){
        const id = req.params.id
        
    }
    
    async deleteVoucherById(req,res,next){
        const id = req.params.id

    }
}

module.exports = new VoucherController()
