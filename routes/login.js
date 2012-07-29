module.exports=function(app,express,mongoose){
	
	app.get('/login', function(req,res){
		var logged = isLogged(req);
		res.render('login', {logged: logged, title : 'Login'})
	})
	
	var bcrypt = require("bcrypt");

	app.post('/login', function(req,res){
		var email = req.body.email,
			password = req.body.password;
		queryModels['User'].findOne({"email": email}, function(err,doc){
			if (err){
				throw err;
				res.redirect('/');
			}
			if (doc !== null){
				bcrypt.compare(password, doc.password, function(_err,_res){
					if (_res === true){
						res.redirect('/');
						req.session.user = doc;
					} else {
						res.redirect('/login')
					}
				})
			} else {
				res.redirect('/')
			}
		})
	})
}