/* eslint-disable import/extensions,no-underscore-dangle */
import authMiddleware from '../../../middleware/authMiddleware.js'
import cartService from '../../../services/cartService.js'
import cartValidation from '../../../validation/cartValidation.js'

const cartController = async (fastify) => {
    const rootOpts = {
        preHandler: authMiddleware,
    }
    fastify.get('/', rootOpts, async (request, reply) => {
        const sessionUserId = request.session.user.id
        //reply.send({ hello: 'World' })
        let sessionUserCart = await cartService.getCartByUserId(sessionUserId)

        if (sessionUserCart === null) {
            console.warn(`no cart given for user ${sessionUserId}`)
            sessionUserCart = await cartService
                .createCart(sessionUserId)
                .catch((error) => {
                    reply
                        .status(500)
                        .send({ success: false, message: error.message })
                })
        }

        reply.status(200).send({ success: true, cart: sessionUserCart })
    })

    const updateCartOpts = {
        preHandler: authMiddleware,
        schema: {
            type: 'object',
            body: {
                required: ['cartEntries'],
                properties: {
                    cartEntries: { type: 'array' },
                },
            },
        },
    }

    fastify.post('/checkout', updateCartOpts, async (request, reply) => {
        const sessionUserId = request.session.user.id
        console.log(request.body.product)
        const cart = await cartService
            .getCartByUserId(sessionUserId)
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
        // create cart if it doesnt exist yet
        if (cart === null) {
            await cartService.createCart(sessionUserId)
        }

        console.log('cart')
        console.log(cart)
        // add the product
        await cartService
            .updateCart(cart, request.body.cartEntries)
            .then((patchedCart) => {
                reply.status(201).send({ success: true, cart: patchedCart })
            })
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
        // If we reacher here something went wrong
        reply
            .status(500)
            .send({ success: false, message: 'something went wrong' })
    })
    /** example request body:
     * {
     *     product: {
     *         productId: "22",
     *         productOptions: {
     *             color: "red",
     *             size: "L"
     *         }
     *     }
     * }
     */
    const pushRemoveOpts = {
        preHandler: authMiddleware,
        schema: {
            type: 'object',
            body: {
                required: ['product'],
                properties: {
                    product: cartValidation.productValidationSchema,
                    // works only for /remove.
                    // Set to true to set quantity to 0
                    removeAll: { type: 'boolean' },
                },
            },
        },
    }
    /**
     * pushes one product to the cart and responds with the new cart
     *
     * Thanks to the validation schema we can assert
     * the product data is always correct
     */
    fastify.post('/push', pushRemoveOpts, async (request, reply) => {
        const sessionUserId = request.session.user.id
        console.log(request.body.product)
        const cart = await cartService
            .getCartByUserId(sessionUserId)
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
        // create cart if it doesnt exist yet
        if (cart === null) {
            await cartService.createCart(sessionUserId)
        }

        console.log('cart')
        console.log(cart)
        // add the product
        await cartService
            .pushProductToCart(cart, request.body.product)
            .then((patchedCart) => {
                reply.status(201).send({ success: true, cart: patchedCart })
            })
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
        // If we reacher here something went wrong
        reply
            .status(500)
            .send({ success: false, message: 'something went wrong' })
    })

    /**
     * Almost same as /push-product
     */
    fastify.post('/remove', pushRemoveOpts, async (request, reply) => {
        const sessionUserId = request.session.user.id
        const cart = await cartService
            .getCartByUserId(sessionUserId)
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
        // create cart if it doesnt exist yet
        if (cart === null) {
            await cartService.createCart(sessionUserId)
        }
        // remove the product
        await cartService
            .removeProductFromCart(
                cart,
                request.body.product,
                request.body.removeAll
            )
            .then((patchedCart) => {
                reply.status(200).send({ success: true, cart: patchedCart })
            })
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
        // If we reacher here something went wrong
        reply
            .status(500)
            .send({ success: false, message: 'something went wrong' })
    })

    const clearOpts = {
        preHandler: authMiddleware,
    }
    fastify.post('/clear', clearOpts, async (request, reply) => {
        const sessionUserId = request.session.user.id
        cartService
            .clearCart(sessionUserId)
            .then((cart) => {
                reply.status(200).send({ success: true, cart })
            })
            .catch((error) =>
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            )
    })
}

export default cartController
