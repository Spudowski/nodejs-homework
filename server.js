const express = require('express');
const cors = require('cors');
const connectDB = require('./service/db')
const path = require('path')
require('dotenv').config();

const contactsRouter = require('./api/contacts')
const usersRouter = require('./api/users')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)
app.use('/api/users/avatars', express.static(path.join(__dirname, 'public/avatars')));

app.use((_, res, __) => {
  res.status(404).json({
    message: `Use API on routes: 
    /api/contacts - Get info about contacts
    /api/registration - registration user { username, email, password }
    /api/login - login { email, password }
    /api/list - get message if user is authenticated`
  })
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