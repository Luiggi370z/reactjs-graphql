function Person(name, foods) {
	this.name = name
	this.foods = foods
}

Person.prototype.fetchFavFoods = function() {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(this.foods), 2000)
	})
}

describe('mocking learning', () => {
	it('mocks a reg function', () => {
		const fetchDogs = jest.fn()
		fetchDogs('snickers')
		expect(fetchDogs).toHaveBeenCalled()
		expect(fetchDogs).toHaveBeenCalledWith('snickers')
		expect(fetchDogs).toHaveBeenCalledTimes(1)
	})

	it('can create a person', () => {
		const me = new Person('Luis', ['pizza', 'tacos'])
		expect(me.name).toBe('Luis')
	})

	it('can fetch foods', async () => {
		const me = new Person('Luis', ['pizza', 'tacos'])
		me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen'])
		const favFoods = await me.fetchFavFoods()
		expect(favFoods).toContain('sushi')
	})
})
