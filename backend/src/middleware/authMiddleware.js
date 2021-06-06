const authMiddleware = async (request, reply) => {
    const { user } = request.session
    if (!(user && user.id)) {
        reply.status(401).send({
            success: false,
            message: 'must be logged in to perform this action',
        })
    }
}

export default authMiddleware
