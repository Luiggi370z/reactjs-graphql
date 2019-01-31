import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import formatMoney from '../lib/formatMoney'

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			price
		}
	}
`

const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION(
		$id: ID!
		$title: String
		$description: String
		$price: Int
	) {
		updateItem(
			id: $id
			title: $title
			description: $description
			price: $price
		) {
			id
			title
			description
			price
		}
	}
`

class UpdateItem extends Component {
	state = {}

	updateItem = async (e, updateItemMutation) => {
		e.preventDefault()
		console.log('Updating item!!')
		console.log(this.state)

		const res = await updateItemMutation({
			variables: {
				id: this.props.id,
				...this.state
			}
		})

		console.log('Updated!!!')
	}

	render() {
		return (
			<Query
				query={SINGLE_ITEM_QUERY}
				variables={{
					id: this.props.id
				}}>
				{({ data, loading }) => {
					if (loading) return <p>Loading...</p>
					if (!data.item) return <p>No item found</p>
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
							{(updateItem, { loading, error }) => (
								<Form
									onSubmit={async e => {
										this.updateItem(e, updateItem)
									}}>
									<Error error={error} />
									<fieldset disabled={loading} aria-busy={loading}>
										<label htmlFor='title'>
											Title
											<input
												id='title'
												type='text'
												name='title'
												id='title'
												placeholder='Title'
												required
												defaultValue={data.item.title}
												onChange={this.handleChange}
											/>
										</label>
										<label htmlFor='price'>
											Price
											<input
												id='price'
												type='number'
												name='price'
												id='price'
												placeholder='Price'
												required
												defaultValue={data.item.price}
												onChange={this.handleChange}
											/>
										</label>
										<label htmlFor='description'>
											description
											<textarea
												name='description'
												id='description'
												placeholder='Enter a description'
												required
												defaultValue={data.item.description}
												onChange={this.handleChange}
											/>
										</label>
										<button type='submit'>
											Sav{loading ? 'ing' : 'e'} changes
										</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					)
				}}
			</Query>
		)
	}

	handleChange = e => {
		const { name, type, value } = e.target
		const val = type === 'number' ? parseFloat(value) : value
		this.setState({ [name]: val })
	}

	uploadFile = async e => {
		console.log('Uploading file...')

		const files = e.target.files
		const data = new FormData()
		data.append('file', files[0])
		data.append('upload_preset', 'sickfits')

		const res = await fetch(
			'https://api.cloudinary.com/v1_1/luiggiamg/image/upload',
			{
				method: 'POST',
				body: data
			}
		)

		const file = await res.json()
		console.log(file)
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url
		})
	}
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
