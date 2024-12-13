import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Usuarios endpoint
export async function getUsuarios(app: FastifyInstance) {
    app.get('/usuarios', 
    // {
    //     preHandler: authenticateJWT,
    // }, 
    async (req, res) => {
        const getUsuariosParams = z.object({
            page: z.coerce.number().min(1).default(1),
            limit: z.coerce.number().min(1).max(100).default(20),
        })

        const { page, limit } = getUsuariosParams.parse(req.params)

        const response = await DatabaseService.getUsuarios(page, limit);
        return response;
    })
}