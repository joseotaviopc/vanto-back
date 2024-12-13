const host = process.env.DB_HOST
const database = process.env.DB_DATABASE
const user = process.env.DB_USER
const jwtSecret = process.env.JWT_SECRET
// const password = process.env.DB_PASSWORD

// console.log('password ', password)
const port = Number(process.env.DB_PORT)
const portApp = Number(process.env.PORT)



if (!host || !database || !user || !jwtSecret || !port || !portApp) {
    throw new Error('Missing environment variables')
}

export { host, database, user, jwtSecret, port, portApp }