const { default: mongoose } = require('mongoose')
const Voucher = require('../model/Voucher')
const Utils = require('../utils/Utils')

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
        if (!mongoose.isValidObjectId(id)) return null
        return await Voucher.findById(id)
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

    async isAvailableVoucher(id) {
        const voucher = this.getVoucherById(id)
        if (!voucher) return null
        const now = new Date().getTime()
        if (
            now > voucher['expired'] ||
            voucher['isActive'] === true ||
            voucher['isExpired'] === true
        )
            return false
        return true
    }

    async checkDiscount(id, price) {
        const voucher = this.getVoucherById(id)
        if (!voucher) return null
        let discount = 0
        //Discount by percentage
        if (voucher['minDiscount'] > price) return null
        if (voucher['type'] === 'Percentage') {
            discount = (price * voucher['discount']) / 100
            if (discount > voucher['max']) discount = voucher['max']
        } else {
            discount = price - voucher['discount']
            if (discount > voucher['max']) discount = voucher['max']
        }
        return [price, discount, price - discount]
    }
}

module.exports = new VoucherService()
