module.exports = function(app, express, mongoose){

	app.get('/', function(req,res){
		var logged = isLogged(req);
		if (req.session.user && req.session.user.role == 2) {
			res.redirect('/org/');
		} else {
			queryModels["Request"].find({status : "unfulfilled"}, function(err,docs){
				if (err) throw err;
				var send = (docs.length <= 4) ? docs : docs.slice(0,4);
				res.render('index', {logged: logged, title: 'Swing', wishes : JSON.stringify(send) });
			})
		}
	})
	app.get('/logout/', function(req,res){
		delete req.session.user
		res.redirect('/')
	})

	app.get('/howitworks', function(req,res){
		var logged = isLogged(req);
		res.render('howitworks', { logged : logged, title: 'How it works'})
	})

	app.get('/organizations', function(req,res){
		var logged = isLogged(req);
		res.render('orgs', { logged : logged, title: 'Organizations'})
	})

	global.queryModels = {
		User : mongoose.model('User'),
		Org : mongoose.model('Org'),
		Request : mongoose.model('Request'),
		Child : mongoose.model('Child')
	}

	require('./routes/dynamic')(app, express, mongoose)

}