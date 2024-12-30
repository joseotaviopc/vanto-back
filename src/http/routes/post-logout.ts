import { FastifyReply, FastifyRequest } from "fastify"
import { authenticateJWT } from "./authenticate"
import { FastifyTypedInstance } from "../../types"
import z from "zod"

export async function postLogout(app: FastifyTypedInstance) {
    app.post('/logout', {
        schema: {
            tags: ['Autenticação'],
            description: 'Logout user',
            response: {
                200: z.object({
                    message: z.string()
                }).describe('OK')
            }
        },
        preHandler: authenticateJWT
    }, (req, reply: FastifyReply) => {
        return reply.clearCookie('refreshToken').status(200).send({ message: 'Logout successful' })
    })
}