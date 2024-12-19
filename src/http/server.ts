import fastify from 'fastify'
import fjwt from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'

import { status } from './routes/status';
import { getTitulos } from './routes/get-titulos';
import { getUsuarios } from './routes/get-usuarios';
import { getUsuarioById } from './routes/get-usuario-by-id';
import { getAutomoveisById } from './routes/get-automoveis';
import { getAutomoveisModalidades } from './routes/get-automoveis-modalidades';
import { postLogin } from './routes/post-login';
import { jwtSecret, portApp } from '../config/env';
import { postLogout } from './routes/post-logout';
import { getAllTitulos } from './routes/get-all-titulos';
import { getAllTitulosGroupedByUser } from './routes/get-all-titulos-group-by-user';
import { getUsuarioByCpf } from './routes/get-usuario-by-cpf';
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
// app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Vanto API',
            description: 'Vanto API documentation',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(fjwt, { secret: jwtSecret || 'secret' });
app.register(fCookie, {
    secret: 'some-secret-key',
    hook: 'preHandler',
});

app.addHook('preHandler', (req, res, next) => {
    req.jwt = app.jwt
    return next()
})

app.register(status)
app.register(getTitulos)
app.register(getAllTitulos)
app.register(getAllTitulosGroupedByUser)
app.register(getUsuarios)
app.register(getUsuarioById)
app.register(getUsuarioByCpf)
app.register(getAutomoveisById)
app.register(getAutomoveisModalidades)
app.register(postLogin)
app.register(postLogout)

app.get('*', ((req, res) => {
    res.status(404).send({ error: "Not Found", message: "The requested resource could not be found." });
}));

app.listen({ port: portApp, host: '::' }).then(() => {
    console.log(`HTTP server running on port ${portApp}`)
})