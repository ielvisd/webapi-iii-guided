const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev')); // one of the options for the display format is 'dev'
server.use(methodLogger);
server.use(addName);
// server.use(moodyGateKeeper);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
	const nameInsert = req.name ? ` ${req.name}` : '';

	res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// just like that, the homies have become the three amigos (Joshua Keslar Web17)
function methodLogger(req, res, next) {
	console.log(`${req.method} Request`);
	next();
}

// Add a piece of middleware that add info to the request object
function addName(req, res, next) {
	req.name = req.name || 'Nathan'; // checks if req.name is on the object, if not hardcoded to 'Nathan'
	next();
}

function lockout(req, res, next) {
	res.status(403).json({ message: 'API lockout!' });
}

// You Do (estimated 5 min to complete)
// Ask students to write and use custom middleware called `moodyGateKeeper` that
// returns status code 403 and the message 'you shall not pass!'
// when the seconds on the clock are multiples of 3 and call next()
// for all other times.

function moodyGateKeeper(req, res, next) {
	const seconds = new Date().getSeconds();
	if (seconds % 3 == 0) {
		res.status(403).json({ message: 'API lockout' });
	}
	next();
}

// error handling middleware
server.use((error, req, res, next) => {
	// here you could inspect the error and decide how to respond
	res.status(400).json({ message: 'Bad Panda!', error });
});

module.exports = server;
