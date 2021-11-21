import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'


// Connection URL
console.log("config: ", config)
mongoose.Promise = global.Promise
const mongoUri = config.mongoUri
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', (err) => {
  throw new Error(`unable to connect to database: w/eventon` + err)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})
