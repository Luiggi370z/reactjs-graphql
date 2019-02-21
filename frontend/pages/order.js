import PleaseSignIn from '../components/PleaseSignIn'
import Order from '../components/Order'

const OrderView = props => (
	<div>
		<PleaseSignIn>
			<Order id={props.query.id} />
		</PleaseSignIn>
	</div>
)

export default OrderView
