import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'

const REMOVE_FROM_CART_MUTATION = gql`
	mutation removeFromCart($id: ID!) {
		removeFromCart(id: $id) {
			id
		}
	}
`

const BigButton = styled.button`
	font-size: 3rem;
	background: none;
	border: 0;
	&:hover {
		color: ${props => props.theme.red};
		cursor: pointer;
	}
`

class RemoveFromCart extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired
	}

	render() {
		return (
			<Mutation
				mutation={REMOVE_FROM_CART_MUTATION}
				variables={{ id: this.props.id }}
				update={this.update}
				optimisticResponse={{
					__typename: 'Mutation',
					removeFromCart: {
						__typename: 'CartItem',
						id: this.props.id
					}
				}}>
				{(removeFromCart, { loading, error }) => (
					<BigButton
						title='Delete Item'
						onClick={() => {
							removeFromCart().catch(err => alert(err.message))
						}}
						disabled={loading}>
						&times;
					</BigButton>
				)}
			</Mutation>
		)
	}

	// Will be triggered as soon as we get a response back from the server after a mutation ahs been performed
	update = (cache, payload) => {
		const data = cache.readQuery({ query: CURRENT_USER_QUERY })

		const cartItemId = payload.data.removeFromCart.id
		data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)

		cache.writeQuery({ query: CURRENT_USER_QUERY, data })
	}
}

export default RemoveFromCart
