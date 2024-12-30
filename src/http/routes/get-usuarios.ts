import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Usuarios endpoint
export async function getUsuarios(app: FastifyTypedInstance) {
    app.get('/usuarios', 
    {
        schema: {
            tags: ['Usuários'],
            description: 'Get all usuarios',
            security: [{ bearerAuth: [] }],
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20),
            }),
            response: {
                200: z.object({
                    data: z.array(z.object({
                        id_usuario: z.number(),
                        nome: z.string(),
                        cpf_cnpj: z.string(),
                        data_nascimento: z.union([z.string().nullable(),z.date().nullable()]),
                        ativo: z.number(),
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
    }, 
    async (req, res) => {
        const { page, limit } = req.query

        const response = await DatabaseService.getUsuarios(page, limit);
        return response;
    })
}