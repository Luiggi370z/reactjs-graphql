import React, { Component } from 'react'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Error from './ErrorMessage'
import styled from 'styled-components'

const USER_ORDERS_QUERY = gql`
	query USER_ORDERS_QUERY {
		orders(orderBy: createdAt_DESC) {
			id
			total
			createdAt
			items {
				id
				title
				price
				description
				quantity
				image
			}
		}
	}
`

const OrderUl = styled.ul`
	display: grid;
	grid-gap: 4rem;
	grid-template-columns: repeat(auto-fit, 40%, 1fr);
`

class OrderList extends Component {
	render() {
		return (
			<Query query={USER_ORDERS_QUERY}>
				{({ data: { orders }, loading, error }) => {
					if (error) return <Error error={error} />
					if (loading) return <p>loading...</p>
					return (
						<div>
							<h2>You have {orders.length} orders</h2>
							<OrderUl>
								{orders.map(order => (
									<OrderItemStyles>
										<Link
											href={{ pathname: '/order', query: { id: order.id } }}>
											<a>
												<div className='order-meta'>
													<p>
														{order.items.reduce((a, b) => a + b.quantity, 0)}{' '}
														Items
													</p>
													<p>{order.items.length}</p>
													<p>{order.createdAt}</p>
													<p>{formatMoney(order.total)}</p>
												</div>
												<div className='images'>
													{order.items.map(item => (
														<img
															src={item.image}
															alt={item.title}
															key={item.id}
														/>
													))}
												</div>
											</a>
										</Link>
									</OrderItemStyles>
								))}
							</OrderUl>
						</div>
					)
				}}
			</Query>
		)
	}
}

export default OrderList
