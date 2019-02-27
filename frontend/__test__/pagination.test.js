import wait from 'waait'
import Router from 'next/router'
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import Pagination, { PAGINATION_QUERY } from '../components/Pagination'
import { MockedProvider } from 'react-apollo/test-utils'

Router.router = {
	push() {},
	prefetch() {}
}

function makeMocksFor(length) {
	return [
		{
			request: { query: PAGINATION_QUERY },
			result: {
				data: {
					itemsConnection: {
						__typename: 'aggregate',
						aggregate: {
							count: length,
							__typename: 'count'
						}
					}
				}
			}
		}
	]
}

describe('<Pagination/>', () => {
	it('should displays a loading message', () => {
		const wrapper = mount(
			<MockedProvider mocks={makeMocksFor(1)}>
				<Pagination page={1} />
			</MockedProvider>
		)
		const pagination = wrapper.find('[data-test="pagination"]')
		expect(wrapper.text()).toContain('Loading...')
	})
	it('should displays a loading message', async () => {
		const wrapper = mount(
			<MockedProvider mocks={makeMocksFor(18)}>
				<Pagination page={1} />
			</MockedProvider>
		)
		await wait()
		wrapper.update()

		expect(wrapper.find('.totalPages').text()).toEqual('5')
		const pagination = wrapper.find('div[data-test="pagination"]')
		expect(toJSON(pagination)).toMatchSnapshot()
	})

	it('should disables prev button on first page', async () => {
		const wrapper = mount(
			<MockedProvider mocks={makeMocksFor(18)}>
				<Pagination page={1} />
			</MockedProvider>
		)

		await wait()
		wrapper.update()

		expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true)
		expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
	})
	it('should disables last button on last page', async () => {
		const wrapper = mount(
			<MockedProvider mocks={makeMocksFor(18)}>
				<Pagination page={5} />
			</MockedProvider>
		)

		await wait()
		wrapper.update()

		expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
		expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true)
	})
	it('should enable all buttons on a middle page', async () => {
		const wrapper = mount(
			<MockedProvider mocks={makeMocksFor(18)}>
				<Pagination page={3} />
			</MockedProvider>
		)

		await wait()
		wrapper.update()

		expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
		expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
	})
})
