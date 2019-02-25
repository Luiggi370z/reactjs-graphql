import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem'
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { wrap } from 'module'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeItem } from '../lib/testUtils'

describe('<SingleItem/>', () => {
	it('renders with proper data', async () => {
		const mocks = [
			{
				// for
				request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
				// get this
				result: { data: { item: fakeItem() } }
			}
		]
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<SingleItem id='123' />
			</MockedProvider>
		)

		expect(wrapper.text()).toContain('Loading...')
		await wait()
		wrapper.update()
		// console.log(wrapper.debug())
		expect(toJSON(wrapper.find('h2'))).toMatchSnapshot()
		expect(toJSON(wrapper.find('img'))).toMatchSnapshot()
		expect(toJSON(wrapper.find('p'))).toMatchSnapshot()
	})

	it('Error with not found item', async () => {
		const mocks = [
			{
				request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
				result: { errors: [{ message: 'Item not found' }] }
			}
		]

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<SingleItem id='123' />
			</MockedProvider>
		)
		await wait()
		wrapper.update()
		const item = wrapper.find('[data-test="graphql-error"]')

		expect(item.text()).toContain('Item not found')
		expect(toJSON(item)).toMatchSnapshot()
	})
})
