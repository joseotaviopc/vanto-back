import { FastifyInstance } from "fastify"

// Status endpoint
export async function status(app: FastifyInstance) {
    app.get('/status', () => {
        return { message: "api is running" }
    }
    )
}