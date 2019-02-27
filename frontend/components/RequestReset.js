import React, { Component } from 'react'
import Form from './styles/Form'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!) {
		requestReset(email: $email) {
			message
		}
	}
`

class RequestReset extends Component {
	state = {
		email: ''
	}

	saveToState = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	handleSignup(requestReset) {
		return async e => {
			e.preventDefault()
			await requestReset()
			this.setState({ email: '' })
		}
	}

	render() {
		return (
			<Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
				{(requestReset, { error, loading, called }) => (
					<Form
						data-test='form'
						method='post'
						onSubmit={this.handleSignup(requestReset)}>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Request Password Reset</h2>
							<Error error={error} />
							{!error && !loading && called && (
								<p>Success! check your email for the reset confirmation</p>
							)}
							<label htmlFor='email'>
								Email
								<input
									type='email'
									name='email'
									placeholder='email'
									value={this.state.email}
									onChange={this.saveToState}
								/>
							</label>
							<button type='submit'>Request Reset</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		)
	}
}

export default RequestReset
export { REQUEST_RESET_MUTATION }
