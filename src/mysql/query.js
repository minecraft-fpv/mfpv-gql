// @flow

const mysql = require('mysql')

const db = {
  connectionLimit: 3,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: '-05:00',
  // dateStrings: true,
  waitForConnections: true,
  multipleStatements: true,
  ssl: (process.env.DB_HOST || '').includes('amazon') ? 'Amazon RDS' : null,
  typeCast: (field, useDefaultTypeCasting) => {
    if (field.type === 'STRING' && field.length === 16) {
      // BINARY(16)
      const bytes = field.buffer()
      return bytes ? bytes.toString('hex').toUpperCase() : null
    }
    if (field.type === 'JSON') {
      const data = field.string()
      try {
        return JSON.parse(data)
      } catch (err) {
        console.error(err)
        return {}
      }
    }
    if (field.type === 'TINY' && field.length === 1) {
      const parse = field.string()
      if (parse === null) return null
      return parse === '1'
    }
    if (field.type === 'BIT' && field.length === 1) {
      const bytes = field.buffer()
      return bytes && bytes.length === 1 ? bytes[0] === 1 : null
    }
    if (field.type === 'TIMESTAMP' || field.type === 'DATE' || field.type === 'DATETIME') {
      const def = useDefaultTypeCasting()
      return def.toISOString()
    }
    return useDefaultTypeCasting()
  }
}

const pool = mysql.createPool(db)

export function flattenSqlTag(sql: any): string {
  if (typeof sql === 'string') return sql
  sql = mysql.format(sql.sql, sql.values)
  return sql
}

export default function query(sql: any): Promise<any> {
  sql = flattenSqlTag(sql)
  const p = new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (!connection || err) {
        reject(err)
        return
      }

      // console.log('sql', sql)

      // const tik = Date.now()
      connection.query(sql, (err, rows, fields) => {
        // console.log('query time: ', Date.now() - tik)
        if (err) {
          connection.release()
          reject(new Error(sql + '////' + err.toString()))
          return
        }
        connection.release()
        resolve(rows)
      })
    })
  })
  return p.catch(err => {
    console.error(err)
    return []
  })
}