import { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

// Middleware to authenticate JWT
export async function authenticateJWT(req: FastifyRequest, reply: FastifyReply) {
    const authHeader = req.headers.authorization;
    // console.log('authHeader ', authHeader)
    if (!authHeader) {
        return reply.status(401).send({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    // console.log('token ', token)
    if (!token) {
        return reply.status(401).send({ message: 'Token missing' });
    }

    try {
        const decoded = req.jwt.verify<FastifyJWT['user']>(token); // Verify the token
        req.user = decoded; // Attach user info to the request
    } catch (error) {
        return reply.status(403).send({ message: 'Invalid token' });
    }
}