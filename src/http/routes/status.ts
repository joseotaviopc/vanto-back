import { FastifyTypedInstance } from "../../types"

// Status endpoint
export async function status(app: FastifyTypedInstance) {
    app.get('/status', {
        schema: {
            tags: ['Status'],
            description: 'Api status'
        }
    }, () => {
        return { message: "api is running" }
    }
    )
}