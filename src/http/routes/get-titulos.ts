import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Titulos endpoint
export async function getTitulos(app: FastifyTypedInstance) {
    app.get('/titulos/:userId', {
        schema: {
            tags: ['Títulos'],
            description: 'Get all titulos by userId',
            params: z.object({
                userId: z.string().optional(),
            }),
            headers: z.object({
                authorization: z.string(),
            }),
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20)
            })
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {

        const { userId } = req.params
        const { page, limit } = req.query

        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }

        const response = await DatabaseService.getTitulos(Number(userId), page, limit);

        return response;
    })
}