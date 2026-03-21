const express = require('express')
const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
const verifyToken = process.env.VERIFY_TOKEN

// Health check for Render
app.get('/health', (req, res) => res.status(200).send('ok'))

// Meta verification + webhook endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  console.log('META VERIFY HIT', req.originalUrl)

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED')
    return res.status(200).send(challenge)
  }
  return res.sendStatus(403)
})

app.post('/webhook', (req, res) => {
  console.log('WEBHOOK EVENT', JSON.stringify(req.body, null, 2))
  res.sendStatus(200)
})

app.listen(port, () => console.log(`Listening on port ${port}`))