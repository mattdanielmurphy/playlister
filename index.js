const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes/api')
require('dotenv').config()

const port = process.env.PORT || 80

mongoose
	.connect('mongodb://localhost:27017/playlister', { useNewUrlParser: true })
	.then(() => console.log('Database connected successfully'))
	.catch((err) => console.log(err))

// override decprecated promise
mongoose.Promise = global.Promise

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

app.use(bodyParser.json())

app.use('/api', routes)

app.use((err, req, res, next) => {
	console.log(err)
	next()
})

app.listen(port, () => {
	console.log(`Serving running on port ${port}`)
})
