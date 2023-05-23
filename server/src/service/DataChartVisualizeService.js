const Category = require('../model/Category')
const Order = require('../model/Order')
const Product = require('../model/Product')
const User = require('../model/User')
const Voucher = require('../model/Voucher')

class DataChartVisualizeController {
    async getDataOverall() {
        try {
            const listUser = await User.find().countDocuments()
            const listProduct = await Product.find().countDocuments()
            const listCategory = await Category.find().countDocuments()
            const listVoucher = await Voucher.find().countDocuments()
            return { listUser, listProduct, listCategory, listVoucher }
        } catch (error) {
            throw error
        }
    }

    async getRevenueLastNDays(n = 7) {
        const today = new Date()
        // const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const nDaysAgo = new Date()
        nDaysAgo.setDate(nDaysAgo.getDate() - n)
        try {
            const results = await Order.aggregate([
                {
                    $match: {
                        dateOrder: { $gte: nDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%d/%m/%Y',
                                date: '$dateOrder',
                            },
                        },
                        revenue: { $sum: '$subtotal' },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])
            if (!results) throw new Error('Có lỗi xảy ra. Vui lòng thử lại!')
            const revenueData = {}

            const label = []
            for (var i = n; i >= 1; i--) {
                label.push(
                    new Date(today.getDate() - i).toLocaleDateString('en-GB')
                )
            }
            const existingDays = results.map((result) => result._id)
            label.forEach((dayLabel, index) => {
                revenueData[dayLabel] = existingDays.includes(dayLabel)
                    ? results.find((result) => result._id === dayLabel).revenue
                    : 0
            })
            return revenueData
        } catch (error) {
            throw error
        }
    }

    async getDetailsRevenueLastNDays(n = 7) {
        const today = new Date()
        // const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const nDaysAgo = new Date()
        nDaysAgo.setDate(nDaysAgo.getDate() - n)
        try {
            const price = await Order.aggregate([
                {
                    $match: {
                        dateOrder: { $gte: nDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%d/%m/%Y',
                                date: '$dateOrder',
                            },
                        },
                        totalPrice: { $sum: '$totalPrice' },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])
            const discount = await Order.aggregate([
                {
                    $match: {
                        dateOrder: { $gte: nDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%d/%m/%Y',
                                date: '$dateOrder',
                            },
                        },
                        discount: { $sum: '$discount' },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])

            const subtotal = await Order.aggregate([
                {
                    $match: {
                        dateOrder: { $gte: nDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%d/%m/%Y',
                                date: '$dateOrder',
                            },
                        },
                        subtotal: { $sum: '$subtotal' },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])

            const vat = await Order.aggregate([
                {
                    $match: {
                        dateOrder: { $gte: nDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%d/%m/%Y',
                                date: '$dateOrder',
                            },
                        },
                        vat: { $sum: '$vat' },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])

            const feeShip = await Order.aggregate([
                {
                    $match: {
                        dateOrder: { $gte: nDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%d/%m/%Y',
                                date: '$dateOrder',
                            },
                        },
                        feeShip: { $sum: '$feeShip' },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])
            // if (!results) throw new Error('Có lỗi xảy ra. Vui lòng thử lại!')
            const revenueData = {}

            const label = []
            for (var i = n; i >= 1; i--) {
                const daysAgo = new Date()
                daysAgo.setDate(daysAgo.getDate() - i)
                label.push(
                    // new Date(today.getDate() - i).toLocaleDateString('en-GB')
                    daysAgo.toLocaleDateString('en-GB')
                )
            }
            const existingDays = subtotal.map((result) => result._id)
            label.forEach((dayLabel, index) => {
                // revenueData[dayLabel] = existingDays.includes(dayLabel)
                //     ? results.find((result) => result._id === dayLabel).revenue
                //     : 0
                if (existingDays.includes(dayLabel)) {
                    revenueData[dayLabel] = {
                        totalPrice: price.find((p) => p._id === dayLabel)
                            .totalPrice,
                        discount: discount.find((d) => d._id === dayLabel)
                            .discount,
                        subtotal: subtotal.find((s) => s._id === dayLabel)
                            .subtotal,
                        vat: vat.find((v) => v._id === dayLabel).vat,
                        feeShip: feeShip.find((f) => f._id === dayLabel)
                            .feeShip,
                    }
                } else revenueData[dayLabel] = 0
            })
            return revenueData
        } catch (error) {
            throw error
        }
    }

    async getOverallRevenue(fromDate, toDate) {
        try {
            const subtotal = await Order.aggregate([
                {
                    $match: {
                        dateOrder: {
                            $gte: new Date(fromDate),
                            $lte: new Date(
                                new Date(toDate).getTime() + 24 * 1000 * 60 * 60
                            ),
                        },
                    },
                },
            ])
            return subtotal
        } catch (error) {
            throw error
        }
    }
}

const formatDate = () => {}

module.exports = new DataChartVisualizeController()
