import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Automoveis endpoint
export async function getAutomoveisById(app: FastifyTypedInstance) {
    app.get('/automoveis', {
        schema: {
            tags: ['Automóveis'],
            description: 'Get automóveis by user Id',
            security: [{ bearerAuth: [] }],
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20),
                id_usuario: z.coerce.number().optional(),
            })
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const { page, limit, id_usuario } = req.query

        if (!id_usuario) {
            return res.status(400).send({ error: "User ID is required" });
        }

        const response = await DatabaseService.getAutomoveisById(id_usuario, page, limit);

        return response;
    })
}