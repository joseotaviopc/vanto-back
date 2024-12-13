import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Titulos endpoint
export async function getTitulos(app: FastifyInstance) {
    app.get('/titulos/:userId', {
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const getTitulosParams = z.object({
            userId: z.coerce.number().min(1).optional(),
        })

        const getTitulosQuery = z.object({
            page: z.coerce.number().min(1).default(1),
            limit: z.coerce.number().min(1).max(100).default(20)
        })

        const { userId } = getTitulosParams.parse(req.params)
        const { page, limit } = getTitulosQuery.parse(req.query)

        console.log({ userId })

        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }

        const response = await DatabaseService.getTitulos(userId, page, limit);

        return response;
    })
}