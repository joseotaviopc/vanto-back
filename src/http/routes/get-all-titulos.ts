import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Titulos endpoint
export async function getAllTitulos(app: FastifyTypedInstance) {
    app.get('/all-titulos', {
        schema: {
            tags: ['Títulos'],
            description: 'Get all titulos',
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20)
            })
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const { limit, page } = req.query

        const response = await DatabaseService.getAllTitulos(page, limit)

        return response;
    })
}