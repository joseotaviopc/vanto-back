import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { FastifyTypedInstance } from "../../types";

// Login endpoint
export async function postLogin(app: FastifyTypedInstance) {
    app.post('/login', {
        schema: {
            tags: ['Autenticação'],
            description: 'Login user',
            body: z.object({
                cpf_cnpj: z.string(),
                data_nascimento: z.string(),
            })
        }
    }, async (req, res) => {
        const { cpf_cnpj, data_nascimento } = req.body


        if (!cpf_cnpj || !data_nascimento) {
            return res.status(400).send({ error: "CPF/CNPJ and birth date are required" });
        }

        const user = await DatabaseService.authenticateUser(cpf_cnpj, data_nascimento);
        if (!user) {
            return res.status(401).send({ error: "Invalid credentials" });
        }

        const payload = {
            id: user.id_usuario,
            nascimento: user.data_nascimento,
            name: user.nome,
        }

        // console.log(payload)
        const token = req.jwt.sign(payload)
        // console.log(token)
        res.setCookie('access_token', token, {
            path: '/',
            httpOnly: true,
            secure: true,
        })
        return {
            accessToken: token,
            user:
            {
                id: user.id_usuario,
                name: user.nome,
                cpf_cnpj: user.cpf_cnpj,
                data_nascimento: user.data_nascimento
            }
        }
    }
    )
}