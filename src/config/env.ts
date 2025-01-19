import dotenv from 'dotenv'

const requiredEnvVars = ["DB_HOST","DB_DATABASE","DB_USER","DB_PORT","PORT","JWT_SECRET"]; // Add your required vars here
dotenv.config()
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error('Missing environment variables');
    }
});

const host = process.env.DB_HOST
const database = process.env.DB_DATABASE
const user = process.env.DB_USER
const jwtSecret = process.env.JWT_SECRET
// const password = process.env.DB_PASSWORD
// console.log('password ', password)
const port = Number(process.env.DB_PORT)
const portApp = Number(process.env.PORT)

export { host, database, user, jwtSecret, port, portApp }