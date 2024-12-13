import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Usuario by CPF endpoint
export async function getUsuarioById(app: FastifyInstance) {
    app.get('/usuario/:userId', {
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const getUsuarioParams = z.object({
            userId: z.coerce.number().min(1).optional(),
        })

        const { userId } = getUsuarioParams.parse(req.params)

        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }
        
        const response = await DatabaseService.getUsuarioById(userId);
        return response;
    })
}