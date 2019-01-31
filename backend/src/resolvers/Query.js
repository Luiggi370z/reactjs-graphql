// If query is the same as the generated one in prisma.graphql
// then we can forward it directly (no filter, auth or any other logic)
const { forwardTo } = require('prisma-binding')

const Query = {
	items: forwardTo('db'),
	item: forwardTo('db')
	// async items(parent, args, ctx, info) {
	// 	const items = await ctx.db.query.items()
	// 	return items
	// }
}

module.exports = Query
