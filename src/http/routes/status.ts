import z from "zod"
import { FastifyTypedInstance } from "../../types"

// Status endpoint
export async function status(app: FastifyTypedInstance) {
    app.get('/status', {
        schema: {
            tags: ['Status'],
            description: 'Api status',
            response: {
                200: z.object({
                    message: z.string(),
                }).describe('OK'),
            }
        }
        
    }, () => {
        return { message: "api is running" }
    }
    )
}