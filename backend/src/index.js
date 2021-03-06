const cookieParser = require('cookie-parser')
require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')
const jwt = require('jsonwebtoken')

const server = createServer()

// Handle cookies (JWT)
server.express.use(cookieParser())

// Decode JWT to get user info
server.express.use((req, res, next) => {
	const { token } = req.cookies // CookieParser magic 😃

	if (token) {
		const { userId } = jwt.verify(token, process.env.APP_SECRET)
		req.userId = userId
	}

	next()
})

// Decode JWT to get user info
server.express.use(async (req, res, next) => {
	if (!req.userId) return next()

	const user = await db.query.user(
		{ where: { id: req.userId } },
		'{ id, permissions, email, name }'
	)
	req.user = user
	next()
})

server.start(
	{
		cors: {
			credentials: true,
			origin: [process.env.FRONTEND_URL, 'http://localhost:3000']
		}
	},
	deets => {
		console.log(
			`Server is now running on port https://localhost:${deets.port}]`
		)
	}
)
