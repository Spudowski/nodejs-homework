const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors())

const routerApi = require('./api')
app.use('/api', routerApi)

app.use((_, res, __) => {
  res.status(404).json({ message: 'Use API on routes: /api/contacts' })
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({ message: err.message })
})

const PORT = process.env.PORT || 3000
const URI = process.env.URI

const connection = mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API port: ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(`Server is not running. Error message: ${err.message}`)
  })