import React from 'react'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

// Query to local state
const LOCAL_STATE_QUERY = gql`
	query {
		cartOpen @client
	}
`

const TOGGLE_CART_MUTATION = gql`
	mutation {
		toggleCart @client
	}
`

const Cart = props => {
	return (
		<Mutation mutation={TOGGLE_CART_MUTATION}>
			{toggleCart => (
				<Query query={LOCAL_STATE_QUERY}>
					{({ data }) => (
						<CartStyles open={data.cartOpen}>
							<header>
								<CloseButton onClick={toggleCart} title='close'>
									&times;
								</CloseButton>
								<Supreme>Your cart</Supreme>
								<p>You have xyz Items in your cart</p>
							</header>

							<footer>
								<p>$10.10</p>
								<SickButton>Checkout</SickButton>
							</footer>
						</CartStyles>
					)}
				</Query>
			)}
		</Mutation>
	)
}

export default Cart
export { TOGGLE_CART_MUTATION, LOCAL_STATE_QUERY }
