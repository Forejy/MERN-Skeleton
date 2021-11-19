const React = require('react')
const { makeStyles } = require('@material-ui/core/styles')
const Card = require('@material-ui/core/Card')
const CardContent = require('@material-ui/core/CardContent')
const CardMedia = require('@material-ui/core/CardMedia')
const Typography = require('@material-ui/core/Typography')
const unicornbikeImg = require('./../assets/images/unicornbike.jpg')

const useStyles = makeStyles(theme => ({ card: {
	maxWidth: 600,
	margin: 'auto',
	marginTop: theme.spacing(5)
	}, title: {
	padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	color: theme.palette.openTitle },
	media: {
		minHeight: 400
	}
}))

function Home(){
	const classes = useStyles
	return (
		<Card className={ classes.card }>
			<Typography variant="h6" className={ classes.title }>
			</Typography>
			<CardMedia className={ classes.media } image={ unicornbikeImg } title="Unicorn Bicycle"/>
			<CardContent>
				<Typography variant="body2" component="p">
					Welcome to the MERN Skeleton home page.
				</Typography>
			</CardContent>
		</Card>
	)
}

module.exports = Home