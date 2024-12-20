import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";

// Usuario by CPF endpoint
export async function getUsuarioByCpf(app: FastifyTypedInstance) {
    app.get('/usuario', {
        schema: {
            tags: ['Usuários'],
            description: 'Get user by Cpf',
            querystring: z.object({
                cpf: z.string().optional(),
            })
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const { cpf } = req.query

        if (!cpf) {
            return res.status(400).send({ error: "CPF is required" });
        }
        
        const response = await DatabaseService.getUsuarioByCpf(cpf);
        return res.status(200).send(response);
    })
}