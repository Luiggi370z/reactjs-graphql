import SingleItem from '../components/SingleItem'

const Item = ({ query }) => (
	<div>
		<SingleItem id={query.id}>Single page</SingleItem>
	</div>
)

export default Item
