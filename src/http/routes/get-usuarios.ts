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
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20),
            })
        },
        preHandler: authenticateJWT,
    }, 
    async (req, res) => {
        const { page, limit } = req.query

        const response = await DatabaseService.getUsuarios(page, limit);
        return response;
    })
}