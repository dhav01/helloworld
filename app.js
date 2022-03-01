const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cookieParser = require('cookie-parser')
const postRouter = require('./routes/postRouter')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// app.use('/api', postRouter)

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

dotenv.config({ path: './config/config.env' })

module.exports = app
