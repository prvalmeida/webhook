const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

app.get('/webhook', (req, res) => {
  console.log('METHOD:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('QUERY:', req.query);

  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  }

  console.log('VERIFICATION FAILED', { mode, token, verifyToken });
  return res.sendStatus(403);
});

app.post('/webhook', (req, res) => {
  console.log('Webhook event:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});