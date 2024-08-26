import {Pool} from 'pg'
import 'dotenv/config'

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

export async function executeSQL(sqlScript){

    try{
        const pool = new Pool(dbConfig)
        const client = await pool.connect()
        const result = await client.query(sqlScript)
    }catch (error) {
        console.log(`Erro ao executar script:  ${error}`)
    }
}