import { app } from './server'
import { test, expect, describe } from 'vitest'

describe('Status route', () => {
    test('GET /status should return api is runing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/status'
        })

        expect(response.statusCode).toBe(200)
        expect(response.payload).toBe('{"message":"api is running"}')
    })
})

describe('Login route', () => {
    test('POST /login should return status 400 if no cpf_cnpj or data_nascimento', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            body: {
                cpf_cnpj: '35588462149',
                data_nascimento: ''
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toBe('{"error":"CPF/CNPJ and birth date are required"}')
    })

    test('POST /login should return status 401 if no user found', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            body: {
                cpf_cnpj: '35588462149',
                data_nascimento: '2000-01-01'
            }
        })

        expect(response.statusCode).toBe(401)
        expect(response.payload).toBe('{"error":"Invalid credentials"}')
    })

    test.skip('POST /login should return accessToken and user data if user found', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            body: {
                cpf_cnpj: '24892360597',
                data_nascimento: '20/01/1962'
            }
        })

        expect(response.statusCode).toBe(200)

    })
})

describe('Logout route', () => {
    test('POST /logout should return status 200', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/logout',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
        expect(response.payload).toBe('{"message":"Logout successful"}')
    })
})

describe('Títulos route', () => {
    test('GET /titulos/:userId should return status 400 if no userId is provided', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titulos/',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toBe('{"error":"User ID is required"}')
    })

    test('GET /titulos/:userId should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titulos/133386',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /titulos/:userId should return properties data and pagination', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/titulos/133386',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        const responseParsed = JSON.parse(response.body)
        expect(responseParsed).toHaveProperty('data')
        expect(responseParsed.data[0]).toBeInstanceOf(Object)
        expect(responseParsed).toHaveProperty('pagination')
    })

    test('GET /titulos/:userId should return data with properties id_titulo, vencimento, pagamento, id_usuario, id_automovel, cpf_cnpj, valor, valor_pago, parcela, forma_pagamento, id_contrato, codigo_boleto, link_boleto and codigo_pix',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/titulos/133386',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body).data[0]

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_titulo')
            expect(responseParsed).toHaveProperty('vencimento')
            expect(responseParsed).toHaveProperty('pagamento')
            expect(responseParsed).toHaveProperty('id_usuario')
            expect(responseParsed).toHaveProperty('id_automovel')
            expect(responseParsed).toHaveProperty('cpf_cnpj')
            expect(responseParsed).toHaveProperty('valor')
            expect(responseParsed).toHaveProperty('valor_pago')
            expect(responseParsed).toHaveProperty('parcela')
            expect(responseParsed).toHaveProperty('forma_pagamento')
            expect(responseParsed).toHaveProperty('id_contrato')
            expect(responseParsed).toHaveProperty('codigo_boleto')
            expect(responseParsed).toHaveProperty('link_boleto')
            expect(responseParsed).toHaveProperty('codigo_pix')
    })
})

describe('All Títulos route', () => {
    test('GET /all-titulos should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/all-titulos',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /all-titulos should return properties data and pagination', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/all-titulos',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        const responseParsed = JSON.parse(response.body)
        expect(responseParsed).toHaveProperty('data')
        expect(responseParsed.data[0]).toBeInstanceOf(Object)
        expect(responseParsed).toHaveProperty('pagination')
    })

    test('GET /all-titulos should return data with properties id_titulo, vencimento, pagamento, id_usuario, id_automovel, cpf_cnpj, valor, valor_pago, parcela, forma_pagamento, id_contrato, codigo_boleto, link_boleto and codigo_pix',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/all-titulos',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body).data[0]

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_titulo')
            expect(responseParsed).toHaveProperty('vencimento')
            expect(responseParsed).toHaveProperty('pagamento')
            expect(responseParsed).toHaveProperty('id_usuario')
            expect(responseParsed).toHaveProperty('id_automovel')
            expect(responseParsed).toHaveProperty('cpf_cnpj')
            expect(responseParsed).toHaveProperty('valor')
            expect(responseParsed).toHaveProperty('valor_pago')
            expect(responseParsed).toHaveProperty('parcela')
            expect(responseParsed).toHaveProperty('forma_pagamento')
            expect(responseParsed).toHaveProperty('id_contrato')
            expect(responseParsed).toHaveProperty('codigo_boleto')
            expect(responseParsed).toHaveProperty('link_boleto')
            expect(responseParsed).toHaveProperty('codigo_pix')
    })
})

describe('All Títulos Grouped by User route', () => {
    test('GET /all-titulos-grouped-by-user should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/all-titulos-grouped-by-user',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /all-titulos-grouped-by-user should return properties data and pagination', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/all-titulos-grouped-by-user',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        const responseParsed = JSON.parse(response.body)
        expect(responseParsed).toHaveProperty('data')
        expect(responseParsed.data[0]).toBeInstanceOf(Object)
        expect(responseParsed).toHaveProperty('pagination')
    })

    test('GET /all-titulos-grouped-by-user should return data with properties id_usuario and titulo_count',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/all-titulos-grouped-by-user',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body).data[0]

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_usuario')
            expect(responseParsed).toHaveProperty('titulo_count')
    })
})

describe('Usuários route', () => {
    test('GET /usuarios should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/usuarios',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /usuarios should return properties data and pagination', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/usuarios',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        const responseParsed = JSON.parse(response.body)
        expect(responseParsed).toHaveProperty('data')
        expect(responseParsed.data[0]).toBeInstanceOf(Object)
        expect(responseParsed).toHaveProperty('pagination')
    })

    test('GET /usuarios should return data with properties id_usuario, nome, cpf_cnpj, data_nascimento and ativo',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/usuarios',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body).data[0]

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_usuario')
            expect(responseParsed).toHaveProperty('nome')
            expect(responseParsed).toHaveProperty('cpf_cnpj')
            expect(responseParsed).toHaveProperty('data_nascimento')
            expect(responseParsed).toHaveProperty('ativo')
    })
})

describe('Usuários by Id route', () => {
    test('GET /usuario/:userId should return status 400 if no userId is provided', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/usuario/',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toBe('{"error":"User ID is required"}')
    })

    test('GET /usuario/:userId should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/usuario/133386',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /usuario/:userId should return data with properties id_usuario, nome, cpf_cnpj, data_nascimento and ativo',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/usuario/133386',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body)

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_usuario')
            expect(responseParsed).toHaveProperty('nome')
            expect(responseParsed).toHaveProperty('cpf_cnpj')
            expect(responseParsed).toHaveProperty('data_nascimento')
            expect(responseParsed).toHaveProperty('ativo')
    })
})

describe('Usuários by cpf route', () => {
    test('GET /usuario?cpf should return status 400 if no cpf is provided', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/usuario?cpf',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toBe('{"error":"CPF is required"}')
    })

    test('GET /usuario?cpf=24892360597 should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/usuario?cpf=24892360597',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /usuario?cpf=24892360597 should return data with properties id_usuario, nome, cpf_cnpj, data_nascimento and ativo',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/usuario?cpf=24892360597',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body)

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_usuario')
            expect(responseParsed).toHaveProperty('nome')
            expect(responseParsed).toHaveProperty('cpf_cnpj')
            expect(responseParsed).toHaveProperty('data_nascimento')
            expect(responseParsed).toHaveProperty('ativo')
    })
})

describe('Automóveis by Id route', () => {
    test('GET /automoveis?id_usuario should return status 400 if no id_usuario is provided', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/automoveis?id_usuario',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toBe('{"error":"User ID is required"}')
    })

    test('GET /automoveis?id_usuario=133386 should return status 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/automoveis?id_usuario=133386',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('GET /automoveis?id_usuario=133386 should return properties data and pagination', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/automoveis?id_usuario=133386',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
            }
        })

        const responseParsed = JSON.parse(response.body)
        expect(responseParsed).toHaveProperty('data')
        expect(responseParsed.data[0]).toBeInstanceOf(Object)
        expect(responseParsed).toHaveProperty('pagination')
    })

    test('GET /automoveis?id_usuario=133386 should return data with properties id_automovel, placa, placa_mercosul, marca, modelo and id_usuario',
        async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/automoveis?id_usuario=133386',
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzMzg2LCJuYXNjaW1lbnRvIjoiMTk2Mi0wMS0yMFQwMDowMDowMC4wMDBaIiwibmFtZSI6IlJVQkVNIFNJTFZFU1RSRSBERSBTQU5UQU5BIiwiaWF0IjoxNzM0NzIxMzU3fQ.yegxbNrDOtdBMJtEE5RF6itF8Lem0xzMe011W6wsQAY'
                }
            })

            const responseParsed = JSON.parse(response.body).data[0]
            console.log(responseParsed)

            expect(responseParsed).toBeInstanceOf(Object)
            expect(responseParsed).toHaveProperty('id_automovel')
            expect(responseParsed).toHaveProperty('placa')
            expect(responseParsed).toHaveProperty('placa_mercosul')
            expect(responseParsed).toHaveProperty('marca')
            expect(responseParsed).toHaveProperty('modelo')
            expect(responseParsed).toHaveProperty('id_usuario')
    })
})