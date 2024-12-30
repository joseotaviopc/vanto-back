import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Automoveis-modalidade endpoint
export async function getAutomoveisModalidades(app: FastifyInstance) {
    app.get('/automoveis-modalidade', {
        schema: {
            tags: ['Automóveis'],
            description: 'Get automóveis modalidade',
            security: [{ bearerAuth: [] }],
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20),
                id_usuario: z.coerce.number().optional(),
            })
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const getAutomoveisModalidadesParams = z.object({
            page: z.coerce.number().min(1).default(1),
            limit: z.coerce.number().min(1).max(100).default(20),
        })

        const { page, limit } = getAutomoveisModalidadesParams.parse(req.params)

        const response = await DatabaseService.getAutomoveisModalidade(page, limit);
        return response;
    })
}