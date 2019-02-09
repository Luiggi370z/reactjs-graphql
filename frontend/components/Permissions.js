import React from 'react'
import { Query, Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import gql from 'graphql-tag'
import Table from './styles/Table'
import SickButton from './styles/SickButton'
import PropTypes from 'prop-types'

const possiblePermissions = [
	'ADMIN',
	'USER',
	'ITEMCREATE',
	'ITEMUPDATE',
	'ITEMDELETE',
	'PERMISSIONUPDATE'
]

const UPDATE_PERMISSIONS_MUTATION = gql`
	mutation updatePermissions($permissions: [Permission], $userId: ID!) {
		updatePermissions(permissions: $permissions, userId: $userId) {
			id
			name
			email
			permissions
		}
	}
`

const ALL_USERS_QUERY = gql`
	query {
		users {
			id
			name
			email
			permissions
		}
	}
`
const Permissions = props => {
	return (
		<div>
			<Query query={ALL_USERS_QUERY}>
				{({ data, loading, error }) => (
					<div>
						<Error error={error} />
						<div>
							<h2>Manage permissions</h2>
							<Table>
								<thead>
									<tr>
										<th>Name</th>
										<th>Email</th>
										{possiblePermissions.map(permission => (
											<th key={permission}>{permission}</th>
										))}
										<th />
									</tr>
								</thead>
								<tbody>
									{data.users.map(user => (
										<UserPermissions user={user} key={user.id} />
									))}
								</tbody>
							</Table>
						</div>
					</div>
				)}
			</Query>
		</div>
	)
}

class UserPermissions extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			name: PropTypes.string,
			email: PropTypes.string,
			id: PropTypes.string,
			permissions: PropTypes.array
		}).isRequired
	}

	state = {
		permissions: this.props.user.permissions // Only as seeding initial state
	}

	render() {
		const { user } = this.props
		return (
			<Mutation
				mutation={UPDATE_PERMISSIONS_MUTATION}
				variables={{
					permissions: this.state.permissions,
					userId: user.id
				}}>
				{(updatePermissions, { data, loading, error }) => (
					<React.Fragment>
						{error && (
							<tr>
								<td colSpan='8'>
									<Error error={error} />
								</td>
							</tr>
						)}
						<tr>
							<td>{user.name}</td>
							<td>{user.email}</td>
							{possiblePermissions.map(permission => (
								<td key={permission}>
									<label htmlFor={`${user.id}-permissions-${permission}`}>
										<input
											id={`${user.id}-permissions-${permission}`}
											type='checkbox'
											checked={this.state.permissions.includes(permission)}
											value={permission}
											onChange={e =>
												this.handlePermissionChange(e, updatePermissions)
											}
										/>
									</label>
								</td>
							))}
							<td>
								<SickButton
									type='button'
									disabled={loading}
									onClick={updatePermissions}>
									Updat{loading ? 'ing' : 'e'}
								</SickButton>
							</td>
						</tr>
					</React.Fragment>
				)}
			</Mutation>
		)
	}
	handlePermissionChange = (e, update) => {
		const checkbox = e.target

		let updatedPermissions = [...this.state.permissions]
		if (checkbox.checked) {
			updatedPermissions.push(checkbox.value)
		} else {
			updatedPermissions = updatedPermissions.filter(
				permission => permission === checkbox.value
			)
		}

		this.setState({ permissions: updatedPermissions }, update)
	}
}

export default Permissions
