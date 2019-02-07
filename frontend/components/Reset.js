import React, { Component } from 'react'
import Form from './styles/Form'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import PropTypes from 'prop-types'
import { CURRENT_USER_QUERY } from './User'

const RESET_MUTATION = gql`
	mutation RESET_MUTATION(
		$resetToken: String!
		$password: String!
		$confirmPassword: String!
	) {
		resetPassword(
			resetToken: $resetToken
			password: $password
			confirmPassword: $confirmPassword
		) {
			id
			email
			name
		}
	}
`

class Reset extends Component {
	static propTypes = {
		resetToken: PropTypes.string.isRequired
	}
	state = {
		password: '',
		confirmPassword: ''
	}

	saveToState = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	handleSignup(resetRequest) {
		return async e => {
			e.preventDefault()
			await resetRequest()
			this.setState({ password: '', confirmPassword: '' })
		}
	}

	render() {
		return (
			<Mutation
				mutation={RESET_MUTATION}
				variables={{
					resetToken: this.props.resetToken,
					...this.state
				}}
				refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
				{(resetRequest, { error, loading, called }) => (
					<Form method='post' onSubmit={this.handleSignup(resetRequest)}>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Reset your password</h2>
							<Error error={error} />
							{!error && !loading && called && (
								<p>Password has been reset successfully</p>
							)}
							<label htmlFor='password'>
								Password
								<input
									type='password'
									name='password'
									placeholder='password'
									value={this.state.password}
									onChange={this.saveToState}
								/>
							</label>
							<label htmlFor='confirmPassword'>
								Confirm your Password
								<input
									type='password'
									name='confirmPassword'
									placeholder='confirmPassword'
									value={this.state.confirmPassword}
									onChange={this.saveToState}
								/>
							</label>
							<button type='submit'>Reset</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		)
	}
}

export default Reset
export { RESET_MUTATION as REQUEST_RESET_MUTATION }
