const { default: mongoose } = require('mongoose')
const Voucher = require('../model/Voucher')

class VoucherService {
    async createVoucher(data) {
        const voucher = new Voucher(data)
        const savedVoucher = await voucher.save()
        if (!savedVoucher) return null
        return savedVoucher
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
