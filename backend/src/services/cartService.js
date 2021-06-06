/* eslint-disable import/extensions,no-param-reassign */
import lodash from 'lodash'
import Cart from '../models/cart.js'

const createCart = async (userId) =>
    new Promise((resolve, reject) => {
        new Cart({
            userId,
            products: [],
        })
            .save()
            .then((document) => {
                resolve(document)
            })
            .catch((error) => {
                reject(error)
            })
    })

const getCartByUserId = async (userId) =>
    new Promise((resolve, reject) => {
        Cart.findOne({ userId })
            .then((cart) => resolve(cart))
            .catch((error) => reject(error))
    })

const clearCart = async (userId) =>
    new Promise((resolve, reject) => {
        getCartByUserId(userId)
            .then((cart) => {
                cart.entries = []
                cart.save()
                    .then((savedCart) => resolve(savedCart))
                    .catch((error) => reject(error))
            })
            .catch((error) => reject(error))
    })

const updateCart = async (cartInput, newEntries) => {
    new Promise((resolve, reject) => {
        cartInput.entries.forEach((cartEntry, index) => {
            cartEntry.product.productOptions.quantity = newEntries[index]
        })

        cartInput
            .save()
            .then((cartOutput) => resolve(cartOutput))
            .catch((error) => {
                console.log('FINAL ERROR')
                console.log(error)
                reject(error)
            })
    })
}

const pushProductToCart = async (cartInput, product) =>
    new Promise((resolve, reject) => {
        console.log('Inside cartServices')
        console.log('cartInput')
        console.log(cartInput)
        console.log('Product')
        console.log(product)
        let productExists = false
        cartInput.entries.forEach((cartEntry) => {
            if (
                cartEntry.product.productId == product.productId &&
                cartEntry.product.productOptions.color ==
                    product.productOptions.color &&
                cartEntry.product.productOptions.size ==
                    product.productOptions.size
            ) {
                console.log('cartInput.entries')
                productExists = true
                cartEntry.product.productOptions.quantity +=
                    product.productOptions.quantity
            }
        })

        if (!productExists) {
            cartInput.entries.push({
                product,
            })
            console.log('cartInput.entries')
            console.log(cartInput.entries)
        }

        cartInput
            .save()
            .then((cartOutput) => resolve(cartOutput))
            .catch((error) => {
                console.log('FINAL ERROR')
                console.log(error)
                reject(error)
            })
    })

const removeProductFromCart = async (cartInput, product, removeAll) =>
    new Promise((resolve, reject) => {
        cartInput.entries.forEach((cartEntry, i, entries) => {
            if (lodash.isEqual(cartEntry.product.toJSON(), product)) {
                if (removeAll) {
                    cartEntry.quantity = -1
                } else {
                    cartEntry.quantity -= 1
                }
                if (cartEntry.quantity < 1) {
                    entries.splice(i, 1)
                }
            }
        })

        cartInput
            .save()
            .then((cartOutput) => resolve(cartOutput))
            .catch((error) => reject(error))
    })

export default {
    createCart,
    getCartByUserId,
    clearCart,
    pushProductToCart,
    removeProductFromCart,
    updateCart,
}
