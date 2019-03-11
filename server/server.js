const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const log = require('./logger')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const clientFolder = path.join(__dirname, '..', 'client/build')

// Accept json
app.use(bodyParser.json())

// Serve static files
app.use(express.static(clientFolder))

let connectedCount = 0

io.on('connection', socket => {
	log.debug("A user connected")
	connectedCount++
	log.debug(`There are ${connectedCount} connected users`)

	socket.on('disconnect', () => {
		log.debug("A user disconnected")
		connectedCount--
		log.debug(`There are ${connectedCount} connected users`)
	})
})

// Fail over
app.get('*', (req, res)=>{
	res.sendFile(path.join(clientFolder, 'index.html'))
})

// Start up
const port = process.env.PORT || 5000
server.listen(port)

log.info(`Listing on port ${port}`)