const { default: mongoose } = require('mongoose')
const Order = require('../model/Order')
const Utils = require('../utils/Utils')
const UserService = require('./UserService')
const User = require('../model/User')
const createHttpError = require('http-errors')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const VoucherService = require('./VoucherService')
require('dotenv').config()

class OrderService {
    async createOrder(order) {
        try {
            let discountVoucher = 0
            const voucherCode = order['voucher']
            const userID = order['user']
            const items = order.items
            //get user
            const user = await UserService.getUserById(userID)
            if (items && items.length > 0) {
                // calculate total price of the items
                let [priceResult, itemsResult] = await Utils.getPriceOfItems(
                    items
                )
                order['totalPrice'] = priceResult
                order['items'] = itemsResult
            }
            if (voucherCode) {
                //get voucher
                const voucher = await VoucherService.getVoucherByCode(
                    voucherCode
                )
                //check voucher available
                if (VoucherService.isAvailableVoucher(voucher) === false)
                    throw createHttpError.BadRequest('Voucher invalid')
                //calculate voucher discount
                discountVoucher = VoucherService.checkDiscount(
                    voucher,
                    order['totalPrice']
                )
                order['voucher'] = voucher['_id']
                user['voucher'] = voucher['_id']

                //active the voucher
                voucher['isActive'] = true
                //update voucher
                await voucher.save()
            }
            //Increase user's total orders
            user['totalOrders'] += 1
            //get discount by ranking
            const discountRanking = Utils.getDiscountRanking(user['rank'])
            //calculate total discount (include voucher + ranking)
            const totalDiscount =
                order['totalPrice'] * discountRanking + discountVoucher

            order['discount'] = totalDiscount
            //calculate the order's subtotal
            order['subtotal'] = order['totalPrice'] - order['discount']
            //update user
            await user.save()
            const o = new Order(order)
            return await o.save()
        } catch (error) {
            throw error
        }
    }

    async getOrderById(id) {
        try {
            if (!mongoose.isValidObjectId(id))
                throw new ResourceNotFoundException('Order', 'id', id)
            const order = await Order.findById(id)
                .populate('items.product')
                .populate('voucher')
                .populate('user', '-password')
            if (!order) throw new ResourceNotFoundException('Order', 'id', id)
            return order
        } catch (error) {
            throw error
        }
    }

    async updateOrderById(id, data) {
        try {
            const order = await this.getOrderById(id)
            if (
                (order['status'] === 'Failed' && order['isPaid'] === true) ||
                (order['status'] === 'Succeeded' && order['isPaid'] === true)
            )
                throw createHttpError.BadRequest('Order cannot be updated')

            const userID = order['user']['_id']
            const user = await UserService.getUserById(userID)
            if (!user) throw new ResourceNotFoundException('User', 'id', userID)
            switch (data['status']) {
                case 'Failed':
                    user['percentageOfSuccessfulOrder'] = (
                        (user['successfulOrder'] * 100) /
                        user['totalOrders']
                    ).toFixed(2)
                    break
                case 'Succeeded':
                    user['successfulOrder'] += 1
                    user['percentageOfSuccessfulOrder'] = (
                        (user['successfulOrder'] * 100) /
                        user['totalOrders']
                    ).toFixed(2)
                    user['rewardPoint'] +=
                        order['totalPrice'] / process.env.RATE_REWARD
                    user['rankingPoint'] +=
                        order['totalPrice'] / process.env.RATE_REWARD
                    break
                default:
                    break
            }
            user['rank'] = Utils.upgradeRanking(user['rankingPoint'])
            const updatedUser = await User.findByIdAndUpdate(userID, user, {
                new: true,
                runValidators: true,
            })
            if (!updatedUser)
                throw createHttpError.InternalServerError(
                    'Something went wrong'
                )
            order['status'] = data['status']
            if (order['isPaid'] != true) {
                order['isPaid'] = data['isPaid']
                order['payment'] = data['payment']
            }
            order['payment'] = data['payment']
            // order['deliveryMethod'] = data['deliveryMethod']

            // const updatedOrder = await order.save()
            const updatedOrder = await Order.findOneAndUpdate(
                { _id: id },
                order,
                {
                    new: true,
                    runValidators: true,
                }
            ).populate('user', '-password -refreshToken')
            if (!updatedOrder)
                throw createHttpError.InternalServerError(
                    'Order cannot be updated'
                )
            return updatedOrder
        } catch (error) {
            throw error
        }
    }

    async deleteOrderById(id) {}

    // async updateStatusOrderById(id, status) {
    //     const order = await this.getOrderById(id)
    //     if (!order) return [404, null]
    //     if (order['status'] === 'Failed' || order['status'] === 'Succeeded')
    //         return [500, { error: `Can not updated` }]
    //     const userID = order['user']['_id']
    //     const user = await UserService.getUserById(userID)
    //     switch (status) {
    //         case 'Failed':
    //             user['percentageOfSuccessfulOrder'] = (
    //                 user['successfulOrder'] / user['totalOrders']
    //             ).toFixed(2)
    //             break
    //         case 'Succeeded':
    //             user['successfulOrder'] += 1
    //             user['percentageOfSuccessfulOrder'] = (
    //                 user['successfulOrder'] / user['totalOrders']
    //             ).toFixed(2)
    //             user['rewardPoint'] +=
    //                 order['totalPrice'] / process.env.RATE_REWARD
    //             break
    //         default:
    //             break
    //     }
    //     await User.findByIdAndUpdate(userID, user, { new: true })
    //     order['status'] = status
    //     try {
    //         return [200, await order.save()]
    //     } catch (error) {
    //         return [500, { error: error }]
    //     }
    // }

    async getAllOrder(filter = {}) {
        try {
            const orders = await Order.find(filter)
                .populate('items.product', 'name price -_id')
                .populate('voucher')
                .sort({dateOrder:'desc'})
            // console.log(orders)
            return orders
        } catch (error) {
            throw error
        }
    }
}

module.exports = new OrderService()
