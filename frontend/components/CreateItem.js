import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import { isNumber } from 'util'

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
			<Form
				onSubmit={e => {
					e.preventDefault(console.log(this.state))
				}}>
				<fieldset>
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
		)
	}

	handleChange = e => {
		const { name, type, value } = e.target
		const val = type === 'number' ? parseFloat(value) : value
		this.setState({ [name]: val })
	}
}

export default CreateItem
