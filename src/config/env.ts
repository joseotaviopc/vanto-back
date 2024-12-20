const host = process.env.VITE_DB_HOST
const database = process.env.VITE_DB_DATABASE
const user = process.env.VITE_DB_USER
const jwtSecret = process.env.VITE_JWT_SECRET
// const password = process.env.VITE_DB_PASSWORD

// console.log('password ', password)
const port = Number(process.env.VITE_DB_PORT)
const portApp = Number(process.env.VITE_PORT)



if (!host || !database || !user || !jwtSecret || !port || !portApp) {
    throw new Error('Missing environment variables')
}

export { host, database, user, jwtSecret, port, portApp }