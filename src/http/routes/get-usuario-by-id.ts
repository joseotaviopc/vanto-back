import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Usuario by CPF endpoint
export async function getUsuarioById(app: FastifyTypedInstance) {
    app.get('/usuario/:userId', {
        schema: {
            tags: ['Usuários'],
            description: 'Get user by ID',
            params: z.object({
                userId: z.coerce.number().optional(),
            })
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }
        
        const response = await DatabaseService.getUsuarioById(userId);
        return response;
    })
}