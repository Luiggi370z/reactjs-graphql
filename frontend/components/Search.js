import React, { Component } from 'react'

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'
import debounce from 'lodash.debounce'
import Downshift, { resetIdCounter } from 'downshift'
import Router from 'next/router'

const routeToItem = item => {
	Router.push({
		pathname: '/item',
		query: {
			id: item.id
		}
	})
}

const SEARCH_ITEMS_QUERY = gql`
	query SEARCH_ITEMS_QUERY($searchTerm: String!) {
		items(
			where: {
				OR: [
					{ title_contains: $searchTerm }
					{ description_contains: $searchTerm }
				]
			}
		) {
			id
			image
			title
		}
	}
`

class AutoComplete extends Component {
	state = {
		items: [],
		loading: false
	}

	onChange = debounce(async (e, client) => {
		this.setState({ loading: true })

		// Manually query apollo client
		const res = await client.query({
			query: SEARCH_ITEMS_QUERY,
			variables: { searchTerm: e.target.value }
		})

		this.setState({ items: res.data.items, loading: false })
	}, 350)

	render() {
		resetIdCounter() // Downshift error see documentation
		return (
			<SearchStyles>
				<Downshift
					itemToString={item => (item === null ? '' : item.title)}
					onChange={routeToItem}>
					{({
						getInputProps,
						getItemProps,
						isOpen,
						inputValue,
						highlightedIndex
					}) => (
						<div>
							<ApolloConsumer>
								{client => (
									<input
										type='search'
										{...getInputProps({
											id: 'search',
											type: 'Search',
											placeholder: 'Search for an Item...',
											className: this.state.loading ? 'loading' : '',
											onChange: e => {
												e.persist()
												this.onChange(e, client)
											}
										})}
									/>
								)}
							</ApolloConsumer>
							{isOpen && (
								<DropDown>
									{this.state.items.map((item, index) => (
										<DropDownItem
											key={item.id}
											{...getItemProps({ item })}
											highlighted={index === highlightedIndex}>
											<img src={item.image} alt={item.title} width='50' />
											{item.title}
										</DropDownItem>
									))}
									{!this.state.items.length && !this.state.loading && (
										<DropDownItem>
											Nothing found for <b>{inputValue}</b>
										</DropDownItem>
									)}
								</DropDown>
							)}
						</div>
					)}
				</Downshift>
			</SearchStyles>
		)
	}
}

export default AutoComplete
