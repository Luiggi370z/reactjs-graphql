import React from 'react'
import { CURRENT_USER_QUERY } from './User'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const SIGN_OUT_MUTATION = gql`
	mutation SIGN_OUT_MUTATION {
		signout {
			message
		}
	}
`

const Signout = props => (
	<Mutation
		mutation={SIGN_OUT_MUTATION}
		refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
		{signout => <button onClick={signout}>Sign Out</button>}
	</Mutation>
)

export default Signout
