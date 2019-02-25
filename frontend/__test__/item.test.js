import ItemComponent from '../components/Item'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

const fakeItem = {
	id: 'ABC123',
	title: 'A cool item',
	price: 5000,
	description: 'This item',
	image: 'dog.jpg',
	largeImage: 'largedog.jpg'
}

describe('Item', () => {
	it('render and matches the snapshot', () => {
		const wrapper = shallow(<ItemComponent item={fakeItem} />)

		expect(toJSON(wrapper)).toMatchSnapshot()
	})
})

// describe('<Item/>', () => {
// 	it('renders image properly', () => {
// 		const wrapper = shallow(<ItemComponent item={fakeItem} />)
// 		const img = wrapper.find('img')

// 		expect(img.props().src).toBe(fakeItem.image)
// 		expect(img.props().alt).toBe(fakeItem.title)
// 	})

// 	it('renders and displays properly', () => {
// 		const wrapper = shallow(<ItemComponent item={fakeItem} />)
// 		const PriceTag = wrapper.find('PriceTag')

// 		expect(PriceTag.children().text()).toBe('$50')
// 		expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
// 	})

// 	it('renders out the buttons properly', () => {
// 		const wrapper = shallow(<ItemComponent item={fakeItem} />)
// 		const buttonList = wrapper.find('.buttonList')

// 		expect(buttonList.children()).toHaveLength(3)
// 		expect(buttonList.find('Link')).toHaveLength(1)
// 		expect(buttonList.find('AddToCart')).toBeTruthy()
// 		expect(buttonList.find('DeleteItem')).toBeTruthy()
// 	})
// })
