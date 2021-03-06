import React from 'react'
import Nav from './Nav'
import Link from 'next/link'
import styled from 'styled-components'
import Router from 'next/router'
import NProgress from 'nprogress'
import Cart from './Cart'
import AutoComplete from './Search'

Router.onRouteChangeStart = () => {
	NProgress.start()
}
Router.onRouteChangeComplete = () => {
	NProgress.done()
}
Router.onRouteChangeError = () => {
	NProgress.done()
	console.log('onRouteChangeError Triggered')
}

const Logo = styled.h1`
	font-style: 4rem;
	margin-left: 2rem;
	position: relative;
	z-index: 2;
	transform: skew(-7deg);
	a {
		padding: 0.5rem 1rem;
		background: ${props => props.theme.red};
		color: white;
		text-transform: uppercase;
		text-decoration: none;
	}
	@media (max-width: 1300px) {
		margin: 0;
		text-align: center;
	}
`

const StyledHeader = styled.header`
	.bar {
		border-bottom: 10px solid ${props => props.theme.black};
		display: grid;
		grid-template-columns: auto 1fr;
		justify-content: space-between;
		align-items: stretch;
		@media (max-width: 1300px) {
			grid-template-columns: 1fr;
			align-items: center;
		}
	}
	.sub-bar {
		display: grid;
		grid-template-columns: 1fr auto;
		border-bottom: 1px solid ${props => props.theme.lightgrey};
	}
`

const Header = () => {
	return (
		<StyledHeader>
			<div className='bar'>
				<Logo>
					<Link href='/'>
						<a href=''>Sick Fits</a>
					</Link>
				</Logo>
				<Nav />
			</div>
			<div className='sub-bar'>
				<AutoComplete />
			</div>
			<Cart />
		</StyledHeader>
	)
}

export default Header
