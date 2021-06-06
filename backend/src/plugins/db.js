/* eslint-disable import/extensions */
import mongoose from 'mongoose'
import fp from 'fastify-plugin'
import User from '../models/user.js'
import Cart from '../models/cart.js'

const {
    MONGO_DB_HOST,
    MONGO_DB_PORT,
    MONGO_DB_USER,
    MONGO_DB_PASSWORD,
} = process.env

const connectionString = `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}`
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    user: MONGO_DB_USER,
    pass: MONGO_DB_PASSWORD,
}

export default fp(async (fastify, opts, next) => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connection established.')
    })
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB connection closed.')
    })
    const models = {
        User,
        Cart,
    }
    fastify.decorate('db', { models })

    try {
        await mongoose.connect(connectionString, mongooseOptions)
    } catch (error) {
        console.error(error)
    }

    next()
})
