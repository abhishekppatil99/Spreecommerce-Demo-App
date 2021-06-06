import fp from 'fastify-plugin'
import cors from 'fastify-cors'

export default fp(async (fastify, opts, next) => {
    const options = {
        origin: [
            `http://localhost:${process.env.REACT_PORT}`,
            `http://127.0.0.1:${process.env.REACT_PORT}`,
        ],
        credentials: true,
        exposedHeaders: ['set-cookie'],
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    }

    fastify.register(cors, options)
    next()
})
