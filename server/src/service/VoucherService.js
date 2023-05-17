const { default: mongoose } = require('mongoose')
const Voucher = require('../model/Voucher')
const Utils = require('../utils/Utils')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const moment = require('moment')
const createHttpError = require('http-errors')
class VoucherService {
    async createVoucher(data) {
        const currencyFormat = (price) =>
            price.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            })
        try {
            if (!data['code']) data['code'] = Utils.generateVoucherCode()
            const description = [
                `Giảm giá ${data['discount']}%`,
                `Giá trị đơn hàng tối thiểu ${currencyFormat(
                    data['minOrder']
                )}`,
                `Giảm giá tối đa ${currencyFormat(data['maxDiscount'])}`,
            ]
            data['description'] = description
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
                    'Đơn hàng không đủ điều kiện áp dụng mã giảm giá'
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
            const voucher = await this.getVoucherByCode(
                request['code'].toUpperCase()
            )
            if (this.isAvailableVoucher(voucher) === true) {
                return this.checkDiscount(voucher, request['value'])
            }
            throw createHttpError.BadRequest('Mã giảm giá không tồn tại')
        } catch (error) {
            throw error
        }
    }
}

module.exports = new VoucherService()
