const devBundle = require('./devBundle') //À commenter en prod
const path = require('path')

const app = express()
devBundle.compile(app) //À commenter en prod

const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))