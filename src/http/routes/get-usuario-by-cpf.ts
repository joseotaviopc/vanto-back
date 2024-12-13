import { FastifyInstance } from "fastify";
import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";

// Usuario by CPF endpoint
export async function getUsuarioByCpf(app: FastifyInstance) {
    app.get('/usuario', {
        preHandler: authenticateJWT,
    }, async (req, res) => {
        const getUsuarioParams = z.object({
            cpf: z.string().optional(),
        })

        const { cpf } = getUsuarioParams.parse(req.query)

        if (!cpf) {
            return res.status(400).send({ error: "CPF is required" });
        }
        
        const response = await DatabaseService.getUsuarioByCpf(cpf);
        return response;
    })
}