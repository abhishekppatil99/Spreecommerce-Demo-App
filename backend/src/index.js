/* eslint-disable no-underscore-dangle */
import fastify from 'fastify'
import AutoLoad from 'fastify-autoload'
import env from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Set environment variables
env.config()

// workaround for ESM Syntax
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// the server instance
const app = fastify()

// Autload plugins and routes
const autoload = async (fastifyInstance) => {
    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastifyInstance.register(AutoLoad, {
        dir: join(__dirname, 'plugins'),
    })

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastifyInstance.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
    })
}
autoload(app, {}).catch((error) => console.error(error))

const start = async () => {
    app.listen(process.env.NODE_PORT, process.env.NODE_HOST, (err, address) => {
        if (err) {
            console.error(err)
        }
        console.log(`Server now running on ${address}`)
    })
}

start().catch((error) => console.error(error))
