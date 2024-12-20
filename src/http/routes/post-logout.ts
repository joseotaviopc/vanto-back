import { FastifyReply, FastifyRequest } from "fastify"
import { authenticateJWT } from "./authenticate"
import { FastifyTypedInstance } from "../../types"

export async function postLogout(app: FastifyTypedInstance) {
    app.post('/logout', { 
        schema: {
            tags: ['Autenticação'],
            description: 'Logout user',
        },
        preHandler: authenticateJWT 
    }, (req: FastifyRequest, reply: FastifyReply) => {
        reply.clearCookie('access_token')
        return reply.status(200).send({ message: 'Logout successful' })
    })
}