// If query is the same as the generated one in prisma.graphql
// then we can forward it directly (no filter, auth or any other logic)
const { forwardTo } = require('prisma-binding')

const Query = {
	items: forwardTo('db'),
	item: forwardTo('db'),
	itemsConnection: forwardTo('db'),
	me(parent, args, ctx, info) {
		if (!ctx.request.userId) return null

		return ctx.db.query.user(
			{
				where: { id: ctx.request.userId }
			},
			info
		)
	}
	// async items(parent, args, ctx, info) {
	// 	const items = await ctx.db.query.items()
	// 	return items
	// }
}

module.exports = Query
