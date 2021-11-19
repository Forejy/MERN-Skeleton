// On va avoir un composant general MainRouter, ds les composants react personnalisés
// Ici c'est le composant central

const React = require('react')
const MainRouter = require('./MainRouter')
const { BrowserRouter } = require('react-router-dom')
const { ThemeProvider } = require('@material-ui/styles')
const theme = require('./theme')
const { hot } = require('react-hot-loader')

const App = () => {
	return (
		<BrowserRouter>
			<ThemeProvider theme={ theme }>
					<MainRouter/>
			</ThemeProvider>
		</BrowserRouter>
	)
}

module.exports = hot(module)(App)