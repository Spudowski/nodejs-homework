const express = require('express');
const cors = require('cors');
const connectDB = require('./service/db')
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors())

const routerApi = require('./api')
app.use('/api/contacts', routerApi)

app.use((_, res, __) => {
  res.status(404).json({ message: 'Use API on routes: /api/contacts' })
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({ message: err.message })
})

connectDB();
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})