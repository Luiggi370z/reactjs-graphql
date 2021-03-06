import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'
import NProgress from 'nprogress'
import User, { CURRENT_USER_QUERY } from './User'
import Error from './ErrorMessage'
import calcTotalPrice from '../lib/calcTotalPrice'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const totalItems = cart => {
	return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

const CREATE_ORDER_MUTATION = gql`
	mutation createOrder($token: String!) {
		createOrder(token: $token) {
			id
			charge
			total
			items {
				id
				title
			}
		}
	}
`

class TakeMyMoney extends Component {
	onToken = async (res, createOrder) => {
		NProgress.start()
		// Invoke mutation manually
		const order = await createOrder({
			variables: {
				token: res.id
			}
		}).catch(err => alert(err.message))

		Router.push({
			pathname: '/order',
			query: { id: order.data.createOrder.id }
		})
	}

	render() {
		return (
			<User>
				{({ data: { me }, loading }) => {
					if (loading) return null
					return (
						<Mutation
							mutation={CREATE_ORDER_MUTATION}
							refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
							{createOrder => (
								<StripeCheckout
									amount={calcTotalPrice(me.cart)}
									name='Sick Fits'
									description={`Order of ${totalItems(me.cart)} items`}
									image={
										me.cart.length && me.cart[0].item && me.cart[0].item.image
									}
									// stripeKey='' here put your stripe public key
									currency='USD'
									email={me.email}
									token={res => this.onToken(res, createOrder)}>
									{this.props.children}
								</StripeCheckout>
							)}
						</Mutation>
					)
				}}
			</User>
		)
	}
}

export default TakeMyMoney
export { CREATE_ORDER_MUTATION }
