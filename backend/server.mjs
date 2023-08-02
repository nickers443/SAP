import express from 'express'
import search from './app.mjs'
import ky from 'ky-universal'

const app = express()
const port = 3001

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
