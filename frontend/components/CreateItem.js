import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import formatMoney from '../lib/formatMoney'

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(
			title: $title
			description: $description
			price: $price
			image: $image
			largeImage: $largeImage
		) {
			id
		}
	}
`

class CreateItem extends Component {
	state = {
		title: 'aaaa',
		description: 'bbbbbb',
		image: '',
		largeImage: '',
		price: 0
	}

	render() {
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
				{(createItem, { loading, error }) => (
					<Form
						onSubmit={async e => {
							e.preventDefault()
							const res = await createItem()
							console.log(res)
							Router.push({
								pathname: '/item',
								query: { id: res.data.createItem.id }
							})
						}}>
						<Error error={error} />
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor='image'>
								Image
								<input
									id='image'
									type='file'
									name='image'
									id='image'
									placeholder='Select an image'
									required
									onChange={this.uploadFile}
								/>
								{this.state.image && (
									<img src={this.state.image} alt='Upload preview' />
								)}
							</label>
							<label htmlFor='title'>
								Title
								<input
									id='title'
									type='text'
									name='title'
									id='title'
									placeholder='Title'
									required
									value={this.state.title}
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
									value={this.state.price}
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
									value={this.state.description}
									onChange={this.handleChange}
								/>
							</label>
							<button type='submit'>Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
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

export default CreateItem
export { CREATE_ITEM_MUTATION }
