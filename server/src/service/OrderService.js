const { default: mongoose } = require('mongoose')
const Order = require('../model/Order')
const Utils = require('../utils/Utils')
const UserService = require('./UserService')
const User = require('../model/User')
require('dotenv').config()

class OrderService {
    async createOrder(order) {
        const items = order.items
        console.log(items)
        if (items && items.length > 0) {
            let [priceResult, itemsResult] = await Utils.getPriceOfCombo(items)
            if (typeof priceResult === 'string') return priceResult
            order['totalPrice'] = priceResult
            order['items'] = itemsResult
        }
        const userID = order['user']
        const user = await User.findByIdAndUpdate(
            userID,
            {
                $inc: { totalOrders: 1 },
            },
            { new: true }
        )
        const o = new Order(order)
        return await o.save()
    }

    async getOrderById(id) {
        if (!mongoose.isValidObjectId(id)) return null
        const order = await Order.findById(id)
            .populate('items.product', 'name price -_id')
            .populate('voucher')
            .populate('user', '-password -refreshToken')
        if (!order) return null
        return order
    }

    async updateOrderById(id, data) {
        const order = await this.getOrderById(id)
        if (!order) return [404, null]
        if (order['status'] === 'Failed' || order['status'] === 'Succeeded')
            return [500, { error: `Order cannot be updated` }]
        const userID = order['user']['_id']
        const user = await UserService.getUserById(userID)
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
                break
            default:
                break
        }
        await User.findByIdAndUpdate(userID, user, { new: true })
        order['status'] = data['status']
        order['isPaid'] = data['isPaid']
        order['payment'] = data['payment']
        order['deliveryMethod'] = data['deliveryMethod']
        try {
            return [200, await order.save()]
        } catch (error) {
            return [500, { error: error }]
        }
    }

    async deleteOrderById(id) {}

    async updateStatusOrderById(id, status) {
        const order = await this.getOrderById(id)
        if (!order) return [404, null]
        if (order['status'] === 'Failed' || order['status'] === 'Succeeded')
            return [500, { error: `Can not updated` }]
        const userID = order['user']['_id']
        const user = await UserService.getUserById(userID)
        switch (status) {
            case 'Failed':
                user['percentageOfSuccessfulOrder'] = (
                    user['successfulOrder'] / user['totalOrders']
                ).toFixed(2)
                break
            case 'Succeeded':
                user['successfulOrder'] += 1
                user['percentageOfSuccessfulOrder'] = (
                    user['successfulOrder'] / user['totalOrders']
                ).toFixed(2)
                user['rewardPoint'] +=
                    order['totalPrice'] / process.env.RATE_REWARD
                break
            default:
                break
        }
        await User.findByIdAndUpdate(userID, user, { new: true })
        order['status'] = status
        try {
            return [200, await order.save()]
        } catch (error) {
            return [500, { error: error }]
        }
    }

    async getAllOrder(filter = {}) {
        const orders = await Order.find(filter)
            .populate('items.product', 'name price -_id')
            .populate('voucher')
        return orders
    }
}

module.exports = new OrderService()
