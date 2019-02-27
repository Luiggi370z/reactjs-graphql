import wait from 'waait'
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem'
import { fakeItem } from '../lib/testUtils'

const dogImage = 'https://dog.com/dog.jpg'

// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
	json: () => ({
		secure_url: dogImage,
		eager: [{ secure_url: dogImage }]
	})
})

describe('<CreateItem/>', () => {
	test('should render and matches snapshot', async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem />
			</MockedProvider>
		)

		const form = wrapper.find('form[data-test="form"]') //tag form added to avoid double Form in the snapshot Form component and form tag
		expect(toJSON(form)).toMatchSnapshot()
	})

	test('should uploads a file when changed', async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem />
			</MockedProvider>
		)

		const input = wrapper.find('input[type="file"]') //tag form added to avoid double Form in the snapshot Form component and form tag
		input.simulate('change', { target: { files: ['fakedog.jpg'] } })

		await wait()

		const component = wrapper.find('CreateItem').instance()
		expect(component.state.image).toEqual(dogImage)
		expect(component.state.largeImage).toEqual(dogImage)
		expect(global.fetch).toHaveBeenCalled()

		global.fetch.mockReset()
	})

	test('should udpate state', async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem />
			</MockedProvider>
		)

		wrapper
			.find('#title')
			.simulate('change', { target: { value: 'Testing', name: 'title' } })
		wrapper.find('#price').simulate('change', {
			target: { value: 50000, name: 'price', type: 'number' }
		})
		wrapper.find('#description').simulate('change', {
			target: { value: 'Test description', name: 'description' }
		})

		expect(wrapper.find('CreateItem').instance().state).toMatchObject({
			title: 'Testing',
			price: 50000,
			description: 'Test description'
		})
	})

	test('should udpate state', async () => {
		const item = fakeItem()
		const mocks = [
			{
				request: {
					query: CREATE_ITEM_MUTATION,
					variables: {
						title: item.title,
						description: item.description,
						image: '',
						largeImage: '',
						price: item.price
					}
				},
				result: {
					data: {
						createItem: {
							...fakeItem,
							id: '123', // required field!
							__typename: 'Item'
						}
					}
				}
			}
		]

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<CreateItem />
			</MockedProvider>
		)

		wrapper
			.find('#title')
			.simulate('change', { target: { value: item.title, name: 'title' } })
		wrapper.find('#price').simulate('change', {
			target: { value: item.price, name: 'price', type: 'number' }
		})
		wrapper.find('#description').simulate('change', {
			target: { value: item.description, name: 'description' }
		})

		//mock router
		Router.router = { push: jest.fn() }

		wrapper.find('form').simulate('submit')

		await wait(50)

		expect(Router.router.push).toHaveBeenCalled()
		expect(Router.router.push).toHaveBeenCalledWith({
			pathname: '/item',
			query: { id: '123' }
		})
	})
})
