const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')

const mutations = {
	async createItem(parent, args, ctx, info) {
		// Check if they are logged in
		if (!ctx.request.userId)
			throw new Error('You must be logged in to add new items!')

		const item = await ctx.db.mutation.createItem(
			{
				data: {
					// Relationship between Item and User
					user: {
						connect: {
							id: ctx.request.userId
						}
					},
					...args
				}
			},
			info
		)

		return item
	},
	updateItem(parent, args, ctx, info) {
		// copy of the updates
		const updates = { ...args }

		delete updates.id
		return ctx.db.mutation.updateItem(
			{
				data: updates,
				where: {
					id: args.id
				}
			},
			info
		)
	},
	async deleteItem(parent, args, ctx, info) {
		const where = { id: args.id }

		const item = await ctx.db.query.item({ where }, `{ id title }`)

		return ctx.db.mutation.deleteItem({ where }, info)
	},
	async signup(parent, args, ctx, info) {
		args.email = args.email.toLowerCase()
		// hash their password
		const password = await bcrypt.hash(args.password, 10)
		// create the user in the database
		const user = ctx.db.mutation.createUser(
			{
				data: {
					...args,
					password,
					permissions: { set: ['USER'] }
				}
			},
			info
		)
		// create the JWT token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
		// Set the jwt as a cookie on the response
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365 //1 year
		})

		return user
	},
	async signin(parent, { email, password }, ctx, info) {
		const user = await ctx.db.query.user({ where: { email } })
		if (!user) {
			throw new Error(`No such user found for email ${email}`)
		}

		const valid = await bcrypt.compare(password, user.password)
		if (!valid) {
			throw new Error('Invalid token')
		}

		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		})

		return user
	},
	signout(parent, args, ctx, info) {
		ctx.response.clearCookie('token')
		return {
			message: 'Signout succesfully!'
		}
	},
	async requestReset(parent, args, ctx, info) {
		const user = await ctx.db.query.user({ where: { email: args.email } })
		if (!user) {
			throw new Error(`No such user found for email ${args.email}`)
		}

		const randomBytesPromise = promisify(randomBytes)
		const resetToken = (await randomBytesPromise(20)).toString('hex')
		const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
		const res = await ctx.db.mutation.updateUser({
			where: { email: args.email },
			data: {
				resetToken,
				resetTokenExpiry
			}
		})

		// Send email
		const mailRes = await transport.sendMail({
			from: 'sickfits@gmail.com',
			to: user.email,
			subject: 'Your password reset token',
			html: makeANiceEmail(`Your password reset is here! 
				\n\n
				<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
					Click here to Reset
				</a>`)
		})

		return {
			message: 'Reset quest OK!'
		}
	},
	async resetPassword(
		parent,
		{ resetToken, password, confirmPassword },
		ctx,
		info
	) {
		// Check if passwords matches
		if (password !== confirmPassword) throw new Error("Passwords dont' match")

		// Verify if token is legit or expires
		const [user] = await ctx.db.query.users({
			where: {
				resetToken,
				resetTokenExpiry_gte: Date.now() - 3600000
			}
		})
		if (!user) {
			throw new Error('This token is either expired or invalid!')
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Update the user with the new password
		const updatedUser = await ctx.db.mutation.updateUser({
			where: { email: user.email },
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpiry: null
			}
		})

		// Generate JWT
		const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)

		// Set the JWT cookie
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		})

		return updatedUser
	}
}

module.exports = mutations
