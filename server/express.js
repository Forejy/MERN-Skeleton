const devBundle = require('./devBundle')

const app = express()
devBundle.compile(app)