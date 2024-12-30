import { DatabaseService } from "../../services/database.service";
import { z } from "zod"
import { authenticateJWT } from "./authenticate";
import { FastifyTypedInstance } from "../../types";
import { Result } from "../../utils/result";

// Titulos endpoint
export async function getTitulos(app: FastifyTypedInstance) {
    app.get('/titulos/:userId', {
        schema: {
            tags: ['Títulos'],
            description: 'Get all titulos by userId',
            security: [{ bearerAuth: [] }],
            params: z.object({
                userId: z.string().optional(),
            }),
            querystring: z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).default(20)
            }),
            response: {
                200: z.object({
                    data: z.array(z.object({
                        id_titulo: z.number(),
                        vencimento: z.union([z.string().nullable(),z.date().nullable()]),
                        pagamento: z.null(),
                        id_usuario: z.number(),
                        id_automovel: z.number(),
                        cpf_cnpj: z.string(),
                        valor: z.number(),
                        valor_pago: z.number(),
                        parcela: z.string(),
                        forma_pagamento: z.string(),
                        id_contrato: z.number(),
                        codigo_boleto: z.string(),
                        link_boleto: z.string(),
                        codigo_pix: z.string(),
                    })),
                    pagination: z.object({
                        total: z.number(),
                        page: z.number(),
                        limit: z.number(),
                        totalPages: z.number(),
                    }),
                }).describe('OK'),
                400: z.object({
                    error: z.string(),
                }).describe('Bad request'),
                401: z.object({
                    error: z.string(),
                }).describe('Unauthorized'),
            }
        },
        preHandler: authenticateJWT,
    }, async (req, res) => {

        const { userId } = req.params
        const { page, limit } = req.query

        if (!userId) {
            const result = Result.fail("User ID is required")
            return res.status(400).send({ error: result.error !== null ? result.error : 'An unknown error occurred' });
        }

        const response = await DatabaseService.getTitulos(Number(userId), page, limit);

        return response;
    })
}