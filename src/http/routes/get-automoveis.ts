import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Automoveis endpoint
export async function getAutomoveis(app: FastifyInstance) {
    app.get('/automoveis', {
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const getAutomoveisParams = z.object({
            page: z.coerce.number().min(1).default(1),
            limit: z.coerce.number().min(1).max(100).default(20),
            search: z.string().optional()
        })

        const { page, limit, search } = getAutomoveisParams.parse(req.params)

        const response = search
            ? await DatabaseService.searchAutomoveis(search, page, limit)
            : await DatabaseService.getAutomoveis(page, limit);

        return response;
    })
}