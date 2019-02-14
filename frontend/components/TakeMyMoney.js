import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'
import NProgress from 'nprogress'
import User, { CURRENT_USER_QUERY } from './User'
import Error from './ErrorMessage'
import calcTotalPrice from '../lib/calcTotalPrice'

const totalItems = cart => {
	return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class TakeMyMoney extends Component {
	onToken = res => {}
	render() {
		return (
			<User>
				{({ data: { me } }) => (
					<StripeCheckout
						amount={calcTotalPrice(me.cart)}
						name='Sick Fits'
						description={`Order of ${totalItems(me.cart)} items`}
						image={me.cart[0].item && me.cart[0].item.image}
						stripeKey=''
						currency='USD'
						email={me.email}
						token={res => this.onToken(res)}>
						{this.props.children}
					</StripeCheckout>
				)}
			</User>
		)
	}
}

export default TakeMyMoney
