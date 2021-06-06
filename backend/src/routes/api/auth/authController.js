/* eslint-disable import/extensions,no-underscore-dangle */
import bcrypt from 'bcryptjs'
import User from '../../../models/user.js'
import authMiddleware from '../../../middleware/authMiddleware.js'
import cartService from '../../../services/cartService.js'

const authController = async (fastify) => {
    const registerOpts = {
        schema: {
            type: 'object',
            body: {
                required: [
                    'email',
                    'password',
                    'passwordConfirm',
                    'firstName',
                    'lastName',
                    /* todo: add address params later */
                ],
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    passwordConfirm: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                },
            },
        },
    }
    fastify.post('/register', registerOpts, async (request, reply) => {
        const {
            email,
            password,
            passwordConfirm,
            firstName,
            lastName,
        } = request.body

        // check if given password confirmation matches
        if (passwordConfirm !== password) {
            reply.status(422).send({
                success: false,
                message: 'password confirmation does not match',
            })
        }

        // check if user exists already
        if (await User.exists({ email })) {
            reply.status(422).send({
                success: false,
                message: 'user with this email exists already',
            })
        }

        // save new user
        const hashedPw = await bcrypt.hash(password, 10)
        const user = await new User({
            email,
            password: hashedPw,
            firstName,
            lastName,
        })
            .save()
            .catch((error) => {
                reply
                    .status(500)
                    .send({ success: false, message: error.message })
            })

        // create cart
        await cartService.createCart(user._id).catch((error) => {
            reply.status(500).send({ success: false, message: error.message })
        })

        // We do not want to send all the data back to the frontend
        const sessionUser = JSON.parse(JSON.stringify(user))
        delete sessionUser.__v
        delete sessionUser.password

        // set session
        request.session.user = {
            id: sessionUser._id,
        }

        reply.status(201).send({ success: true, user: sessionUser })
    })

    const loginOpts = {
        schema: {
            type: 'object',
            body: {
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                },
            },
        },
    }
    fastify.post('/login', loginOpts, async (request, reply) => {
        const { email, password } = request.body
        const user = await User.findOne({ email }).exec()

        // user with email does not exist
        if (!user) {
            request.session.user = null
            reply
                .status(401)
                .send({ success: false, message: 'the account was not found' })
        }

        // wrong password
        const pwdValid = await bcrypt.compare(password, user.get('password'))
        if (!pwdValid) {
            request.session.user = null
            reply
                .status(401)
                .send({ success: false, message: 'wrong password' })
        }

        // We do not want to save all the data in the session
        const sessionUser = JSON.parse(JSON.stringify(user))
        delete sessionUser.__v
        delete sessionUser.password

        // set session
        request.session.user = { id: sessionUser._id }

        reply.status(200).send({
            success: true,
            message: 'successfully logged in',
            user: sessionUser,
        })
    })

    const logoutOpts = {
        preHandler: authMiddleware,
    }
    fastify.get('/logout', logoutOpts, async (request, reply) => {
        request.session.user = null
        reply.status(200).send({
            success: true,
            message: 'successfully logged out.',
        })
    })

    const meOpts = {
        preHandler: authMiddleware,
    }
    fastify.get('/me', meOpts, async (request, reply) => {
        const user = await User.findById(request.session.user.id)

        // We do not want to send all the data back to the frontend
        const sessionUser = JSON.parse(JSON.stringify(user))
        delete sessionUser.__v
        delete sessionUser.password

        reply.status(200).send({ success: true, user: sessionUser })
    })
}

export default authController
