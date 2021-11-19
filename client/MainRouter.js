const React = require('react')
const { Route, Switch } = require('react-router-dom')
const Home = require('./core/Home')

const MainRouter = () => {
	return (
		<div>
			<Switch>
				<Route exact path="/" component={ Home }/>
			</Switch>
		</div>
	)
}

module.exports = MainRouter