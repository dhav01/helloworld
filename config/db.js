const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config/config.env' })

const connectDB = async () => {
  try {
    const DB = process.env.MONGO_URI.replace(
      '<password>',
      process.env.DB_PASSWORD
    )

    const conn = await mongoose.connect(DB)
    console.log('Successfully connected to database', conn.connection.host)
  } catch (err) {
    console.error('Error occurred while connecting to DB', err.message)
  }
}
module.exports = connectDB
