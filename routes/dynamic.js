module.exports = function(app, express, mongoose){

	require('./register')(app, express, mongoose)
	require('./login')(app, express, mongoose)
	require('./org')(app, express, mongoose)
	require('./wishlist')(app, express, mongoose)
	require('./browse')(app, express, mongoose)

}