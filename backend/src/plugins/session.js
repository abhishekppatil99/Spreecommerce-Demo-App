import fp from 'fastify-plugin'
import cookie from 'fastify-cookie'
import session from 'fastify-session'

export default fp(async (instance, opts, next) => {
    const { SESSION_SECRET, SESSION_TTL, NODE_ENV } = process.env
    const options = {
        cookieName: 'sessionId',
        secret: SESSION_SECRET,
        cookie: { secure: NODE_ENV !== 'dev' },
        expires: SESSION_TTL,
    }
    instance.register(cookie)
    instance.register(session, options)
    next()
})
