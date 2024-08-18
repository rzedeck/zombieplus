import {Pool} from 'pg'

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'mysecretpassword',
    port: '5432'
}

export async function executeSQL(sqlScript){

    try{
        const pool = new Pool(dbConfig)
        const client = await pool.connect()
        const result = await client.query(sqlScript)
        console.log(result.rows)
    }catch (error) {
        console.log(`Erro ao executar script:  ${error}`)
    }
}