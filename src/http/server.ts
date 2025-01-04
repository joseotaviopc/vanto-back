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
import { Result } from '../utils/result'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit';

type Environment = 'development' | 'production' | 'test';

const env: Environment = process.env.NODE_ENV as Environment || 'development';

const envToLogger = {
  development: { level: 'debug' },
  production: { level: 'info' },
  test: { level: 'error' }
};

const loggerConfig = envToLogger[env] ?? { level: 'info' };

const app = fastify({
    logger: {
        level: loggerConfig.level,
      },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://kit-free.fontawesome.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "ws://localhost:3000"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
});

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Vanto API',
            description: 'Vanto API documentation',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            }
        }
    },

    transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(fjwt, {
    secret: jwtSecret || 'my-secret-key',
    cookie: {
      cookieName: 'refreshToken',
      signed: true,
    },
    sign: {
      expiresIn: '120m'
    }
});

app.register(fCookie);

app.register(status)
app.register(postLogin)

app.register(getTitulos)
app.register(getAllTitulos)
app.register(getAllTitulosGroupedByUser)

app.register(getUsuarios)
app.register(getUsuarioById)
app.register(getUsuarioByCpf)

app.register(getAutomoveisById)
app.register(getAutomoveisModalidades)

app.register(postLogout)

app.setErrorHandler((error, req, res) => {
    if (['FST_ERR_VALIDATION', 'FST_ERR_CTP_EMPTY_JSON_BODY'].includes(error.code)){
        return res.status(400).send(Result.fail("Body or params is required!"));
    }
    console.error(error)
    res.status(500).send(Result.fail("An unexpected error occurred."));

    if (error.statusCode === 429) {
        res.code(429)
        error.message = 'You hit the rate limit! Slow down please!'
    }
    res.send(error)
})

app.get('*', ((req, res) => {
    res.status(404).send(Result.fail("The requested resource could not be found."));
}));

app.listen({ port: portApp, host: '::' }).then(() => {
    console.log(`HTTP server running on port ${portApp}`)
})

export { app }