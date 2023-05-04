const { default: mongoose } = require('mongoose')
const Voucher = require('../model/Voucher')
const Utils = require('../utils/Utils')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const moment = require('moment')
const createHttpError = require('http-errors')
class VoucherService {
    async createVoucher(data) {
        try {
            if (!data['code']) data['code'] = Utils.generateVoucherCode()
            const voucher = new Voucher(data)
            return await voucher.save()
        } catch (error) {
            if (
                error.code === 11000 &&
                error.keyPattern &&
                error.keyPattern.code === 1
            ) {
                data['code'] = Utils.generateVoucherCode()
                return await this.createVoucher(data)
            }
            throw error
        }
    }

    async getVoucherById(id) {
        try {
            if (!mongoose.isValidObjectId(id))
                throw new ResourceNotFoundException('Voucher', 'id', id)
            const voucher = await Voucher.findById(id)
            if (!voucher)
                throw new ResourceNotFoundException('Voucher', 'id', id)
            return voucher
        } catch (error) {
            throw error
        }
    }

    async getVoucherByCode(code) {
        try {
            const voucher = await Voucher.findOne({ code: code })
            if (!voucher)
                throw new ResourceNotFoundException('Voucher', 'code', code)
            return voucher
        } catch (error) {
            throw error
        }
    }

    async getAllVoucher(filter) {
        return await Voucher.find(filter)
    }

    async updateVoucher(id, data) {
        if (!mongoose.isValidObjectId(id)) return null
        const voucher = await Voucher.findByIdAndUpdate(id, {
            isActive: true,
            isExpired: true,
        })
    }

    async deleteVoucher(id) {}

    // async isAvailableVoucher(id) {
    //     const voucher = this.getVoucherById(id)
    //     if (!voucher) return null
    //     const now = new Date().getTime()
    //     if (
    //         now > voucher['expired'] ||
    //         voucher['isActive'] === true ||
    //         voucher['isExpired'] === true
    //     )
    //         return false
    //     return true
    // }
    isAvailableVoucher(voucher) {
        const current = moment()
        if (
            current.isAfter(voucher['expiryDate']) ||
            voucher['isActive'] === true ||
            voucher['isExpired'] === true
        )
            return false
        return true
    }

    checkDiscount(voucher, price) {
        try {
            let discount = 0
            //Discount by percentage
            if (voucher['minOrder'] > price)
                throw createHttpError.BadRequest(
                    'Your order does not have enough condition to use voucher'
                )
            discount = (price * voucher['discount']) / 100
            if (discount > voucher['maxDiscount'])
                discount = voucher['maxDiscount']
            // return [price, discount, price - discount]
            return discount
        } catch (error) {
            throw error
        }
    }

    async useVoucher(request) {
        try {
            const voucher = await this.getVoucherByCode(request['code'].toUpperCase())
            if (this.isAvailableVoucher(voucher) === true) {
                return this.checkDiscount(voucher, request['value'])
            }
            throw createHttpError.BadRequest('Your voucher is not available')
        } catch (error) {
            throw error
        }
    }
}

module.exports = new VoucherService()
