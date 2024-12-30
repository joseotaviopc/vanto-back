import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Titulos endpoint
export async function getAllTitulosGroupedByUser(app: FastifyTypedInstance) {
    app.get('/all-titulos-grouped-by-user', {
        schema: {
            tags: ['Títulos'],
            description: 'Get all titulos grouped by user',
            security: [{ bearerAuth: [] }],
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20)
            }),
            response: {
                200: z.object({
                    data: z.array(z.object({
                        id_usuario: z.number(),
                        titulo_count: z.number(),
                    })),
                    pagination: z.object({
                        total: z.number(),
                        page: z.number(),
                        limit: z.number(),
                        totalPages: z.number(),
                    }),
                }).describe('OK'),
                400: z.object({
                    error: z.string(),
                }).describe('Bad request'),
                401: z.object({
                    error: z.string(),
                }).describe('Unauthorized'),
            }
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const { limit, page } = req.query

        const response = await DatabaseService.getAllTitulosGroupedByUser(page, limit)

        return response;
    })
}