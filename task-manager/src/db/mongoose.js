const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true, // automatic index builder
  useUnifiedTopology: true,
  useFindAndModify: false
})