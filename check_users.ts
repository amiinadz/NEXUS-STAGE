import db from '@adonisjs/lucid/services/db'

const users = await db.from('users').select('*')
console.log(users)

process.exit(0)