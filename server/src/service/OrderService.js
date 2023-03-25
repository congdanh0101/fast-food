const { default: mongoose } = require('mongoose')
const Order = require('../model/Order')
const Utils = require('../utils/Utils')
const UserService = require('./UserService')
const User = require('../model/User')
const createHttpError = require('http-errors')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
require('dotenv').config()

class OrderService {
    async createOrder(order) {
        try {
            const items = order.items
            if (items && items.length > 0) {
                let [priceResult, itemsResult] = await Utils.getPriceOfCombo(
                    items
                )
                order['totalPrice'] = priceResult
                order['items'] = itemsResult
            }
            // order['subtotal'] = order['totalPrice'] - order['discount']
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
        } catch (error) {
            throw error
        }
    }

    async getOrderById(id) {
        try {
            if (!mongoose.isValidObjectId(id))
                throw new ResourceNotFoundException('Order', 'id', id)
            const order = await Order.findById(id)
                .populate('items.product', 'name price -_id')
                .populate('voucher')
                .populate('user', '-password -refreshToken')
            if (!order) throw new ResourceNotFoundException('Order', 'id', id)
            return order
        } catch (error) {
            throw error
        }
    }

    async updateOrderById(id, data) {
        try {
            const order = await this.getOrderById(id)
            if (!order) throw new ResourceNotFoundException('Order', 'id', id)
            if (order['status'] === 'Failed' || order['status'] === 'Succeeded')
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
            order['isPaid'] = data['isPaid']
            order['payment'] = data['payment']
            order['deliveryMethod'] = data['deliveryMethod']

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
        try {
            const orders = await Order.find(filter)
                .populate('items.product', 'name price -_id')
                .populate('voucher')
            // console.log(orders)
            return orders
        } catch (error) {
            throw error
        }
    }
}

module.exports = new OrderService()
