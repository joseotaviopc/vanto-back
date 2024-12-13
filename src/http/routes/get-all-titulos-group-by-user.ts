import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Titulos endpoint
export async function getAllTitulosGroupedByUser(app: FastifyInstance) {
    app.get('/all-titulos-grouped-by-user', {
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const getTitulosParams = z.object({
            page: z.coerce.number().min(1).default(1),
            limit: z.coerce.number().min(1).max(100).default(20)
        })

        const { limit, page } = getTitulosParams.parse(req.params)

        const response = await DatabaseService.getAllTitulosGroupedByUser(page, limit)

        return response;
    })
}