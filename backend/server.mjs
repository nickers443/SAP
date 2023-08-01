import express from 'express'
import search from './app.mjs'

const app = express()
const port = 3001

app.get('/sendCode', async (req, res) => {
  if (req.query.code.length !== '' || req.query.code.length !== ' ') {
    const data = await search(req.query.code)
    res.json(data)
  }
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})
