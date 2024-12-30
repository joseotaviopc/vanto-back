import { FastifyReply, FastifyRequest } from "fastify";
import { errAsync, ResultAsync } from "neverthrow";

// Middleware to authenticate JWT
export async function authenticateJWT(req: FastifyRequest, reply: FastifyReply) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return errAsync(reply.status(401).send({ message: 'Authorization header missing' }))
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) {
        return errAsync(reply.status(401).send({ message: 'Token missing' }));
    }

    return ResultAsync.fromPromise(req.jwtVerify(), () => {
        console.error('Error verifying token');
        return reply.status(403).send({ message: 'Invalid token' });
    });
}