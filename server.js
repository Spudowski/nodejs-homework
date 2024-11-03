const app = require('./app')

const PORT = 2115;
app.listen(PORT, () => {
  console.log(`Server running API on port: ${PORT}`)
})
