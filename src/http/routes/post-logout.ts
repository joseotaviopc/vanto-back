import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { authenticateJWT } from "./authenticate"

export async function postLogout(app: FastifyInstance) {
    app.post('/logout', { preHandler: authenticateJWT }, (req: FastifyRequest, reply: FastifyReply) => {
        reply.clearCookie('access_token')
        return reply.send({ message: 'Logout successful' })
    })
}