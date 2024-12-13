import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import cors from '@fastify/cors'

import { status } from './routes/status';
import { getTitulos } from './routes/get-titulos';
import { getUsuarios } from './routes/get-usuarios';
import { getUsuarioById } from './routes/get-usuario-by-id';
import { getAutomoveis } from './routes/get-automoveis';
import { getAutomoveisModalidades } from './routes/get-automoveis-modalidades';
import { postLogin } from './routes/post-login';
import { jwtSecret, portApp } from '../config/env';
import { postLogout } from './routes/post-logout';
import { authenticateJWT } from './routes/authenticate';
import { getAllTitulos } from './routes/get-all-titulos';
import { getAllTitulosGroupedByUser } from './routes/get-all-titulos-group-by-user';
import { getUsuarioByCpf } from './routes/get-usuario-by-cpf';

const app = fastify()
// console.log(authenticateJWT)

app.register(cors, {
    // put your options here
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})
// Register JWT and cookie plugins
app.register(fjwt, { secret: jwtSecret || 'secret' });
app.register(fCookie, {
    secret: 'some-secret-key',
    hook: 'preHandler',
});

// Register the authenticateJWT middleware globally
// app.addHook('preHandler', authenticateJWT);


// jwt
// app.register(fjwt, { secret: jwtSecret || 'secret' })


// app.decorate(
//     'authenticate',
//     async (req: FastifyRequest, reply: FastifyReply) => {
//         const token = req.cookies.access_token
//         if (!token) {
//             return reply.status(401).send({ message: 'Authentication required' })
//         }
//         // here decoded will be a different type by default but we want it to be of user-payload type
//         const decoded = req.jwt.verify<FastifyJWT['user']>(token)
//         req.user = decoded
//     },
// )

app.addHook('preHandler', (req, res, next) => {
    // here we are
    req.jwt = app.jwt
    return next()
})
// // cookies
// app.register(fCookie, {
//     secret: 'some-secret-key',
//     hook: 'preHandler',
// })

app.register(status)
app.register(getTitulos)
app.register(getAllTitulos)
app.register(getAllTitulosGroupedByUser)
app.register(getUsuarios)
app.register(getUsuarioById)
app.register(getUsuarioByCpf)
app.register(getAutomoveis)
app.register(getAutomoveisModalidades)
app.register(postLogin)
app.register(postLogout)



//     try {
//       // Serve Swagger UI
//       if (path === '/docs') {
//         return new Response(SWAGGER_UI_HTML, {
//           headers: { ...corsHeaders, 'Content-Type': 'text/html' }
//         });
//       }

//       // Serve Swagger JSON
//       if (path === '/swagger.json') {
//         return new Response(JSON.stringify(swaggerSpec), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//         });
//       }

//       // Route not found
//       return new Response(JSON.stringify({ error: "Not Found" }), {
//         status: 404,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });

//     } catch (error) {
//       return handleError(error);
//     }
//   }

app.listen({ port: portApp, host: '::' }).then(() => {
    console.log(`HTTP server running on port ${portApp}`)
})