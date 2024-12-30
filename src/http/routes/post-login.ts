import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { FastifyTypedInstance } from "../../types";
import { Result } from "../../utils/result";

// Login endpoint
export async function postLogin(app: FastifyTypedInstance) {
    app.post('/login',
        {
            schema: {
                tags: ['Autenticação'],
                description: 'Login user',
                body: z.object({
                    cpf_cnpj: z.string(),
                    data_nascimento: z.string(),
                }),
                response: {
                    200: z.object({
                        accessToken: z.string(),
                        user: z.object({
                            id: z.number(),
                            name: z.string(),
                            cpf_cnpj: z.string(),
                            data_nascimento: z.union([z.string().nullable(),z.date().nullable()]),
                        })
                    }).describe('OK'),
                    400: z.object({
                        error: z.string(),
                    }).describe('Bad request'),
                    401: z.object({
                        error: z.string(),
                    }).describe('Unauthorized'),
                }
            }
        },
        async (req, res) => {
            const { cpf_cnpj, data_nascimento } = req.body

            if (!cpf_cnpj || !data_nascimento) {
                const result = Result.fail("CPF/CNPJ and birth date are required");
                return res.status(400).send({ error: result.error !== null ? result.error : 'An unknown error occurred' });
            }

            const user = await DatabaseService.authenticateUser(cpf_cnpj, data_nascimento);
            if (!user) {
                const result = Result.fail("Invalid credentials");
                return res.status(401).send({ error: result.error !== null ? result.error : 'An unknown error occurred' });
            }

            const payload = {
                id: user.id_usuario,
                nascimento: user.data_nascimento,
                name: user.nome,
            }

            const token = await res.jwtSign(payload)

            res.setCookie('payload', JSON.stringify(payload), {
                path: '/',
                secure: false, // send cookie over HTTPS only
                httpOnly: true,
                sameSite: true
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