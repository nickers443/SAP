import express from 'express'
import search from './app.mjs'
import ky from 'ky-universal'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { router } from './routes/HistorySearchRoutes.mjs'
import 'dotenv/config'

const app = express()
const port = process.env.PORT

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/history', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () => {
  console.log('Mongo подключили')
})

app.get('/sendCode', async (req, res) => {
  if (req.query.code.length !== '' || req.query.code.length !== ' ') {
    const data = await search(req.query.code)
    res.json(data)
  }
})

app.get('/getSmsBalance', async (req, res) => {
  try {
    const balance = await ky(process.env.SMS_URL_GETBALANCE, {
      searchParams: {
        login: process.env.SMS_LOGIN,
        psw: process.env.SMS_PSW,
        fmt: 3,
      },
    }).json()
    res.json(balance)
  } catch (error) {
    res.json(error)
  }
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/api/historySearch', router)
