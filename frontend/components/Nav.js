import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'

const Nav = () => {
	return (
		<User>
			{({ data: { me } }) => (
				<NavStyles>
					<Link href='/items'>
						<a>Shop</a>
					</Link>
					{me && (
						<React.Fragment>
							<Link href='/sell'>
								<a>Sell</a>
							</Link>
							<Link href='/orders'>
								<a>Orders</a>
							</Link>
							<Link href='/me'>
								<a>Account</a>
							</Link>
							<Signout />
						</React.Fragment>
					)}
					{!me && (
						<Link href='/signup'>
							<a>Signin</a>
						</Link>
					)}
				</NavStyles>
			)}
		</User>
	)
}

export default Nav
