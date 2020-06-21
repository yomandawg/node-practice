const app = require('./app') // SETUP EXPRESS APPLICATION

const port = process.env.PORT

// separate the `app` with `listen` for development purposes
app.listen(port, () => {
  console.log('Server is up on port ' + port)
})