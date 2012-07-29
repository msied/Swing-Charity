module.exports=function(app,express,mongoose){

	var bcrypt = require("bcrypt");

	app.get('/register/', function(req,res){
		var logged = isLogged(req);
		res.render('register', {logged: logged, title : 'Registration'})
	})

	app.get('/register/donor', function(req,res){
		var logged = isLogged(req);
		res.render('register_donor', {logged: logged, title : 'Donor Registration'})
	})

	app.get('/register/org', function(req,res){
		var logged = isLogged(req);
		res.render('register_org', {logged: logged, title : 'Organization Registration'});
	})

	app.get('/register/org/details', function(req,res){
		var logged = isLogged(req);
		if (req.session.user.role !== 2){
			res.redirect('/');
		} else {
			res.render('register_org_details', {logged : logged, title : 'Organization Registration Step 2', organization : req.session.user.organization});
		}
	})
	app.post('/register/org/details', function(req,res){
		if (req.session.user.role !== 2){
			res.redirect('/');
		} else {
			queryModels['Org'].findOne({admin_id : req.session.user._id}, function(err,doc){
				doc.details = req.body.details;
				doc.logo = req.body.logo;
				doc.address = req.body.address;
				doc.save(function(err){
					if (err) throw err;
					res.redirect('/org/manage')
				})
			})
		}
	})

	app.post('/register/:role?', function(req,res){
		var email = req.body.email,
			password = req.body.password,
			password_r = req.body.password_r;
		if (!email.match('@')){
			res.redirect('/register/' + req.params.role)
			return;
		}
		queryModels['User'].findOne({"email":email}, function(err,doc){
			if (err) throw err;
			if (doc !== null){
				res.redirect('/register/' + req.params.role)
			} else {
				if (password === password_r){
					bcrypt.genSalt(10, function(err, salt){
						bcrypt.hash(password, salt, function(err, hash){
							var newUser = new queryModels['User']();
							newUser.salt = salt;
							newUser.name = {
								first : req.body.first_name,
								last : req.body.last_name
							}
							newUser.phone = req.body.phone;
							if (req.params.role !== "donor"){
								newUser.organization = req.body.organization;
								newUser.approved = true;
							}
							newUser.role = (req.params.role == "donor") ? 1 : 2;
							newUser.email = email;
							newUser.password = hash;
							newUser.save(function(err, doc){
								if (err){
									throw err;
									res.redirect('/register/' + req.params.role)
								} else {
									req.session.user = doc;
									if (req.params.role !== "donor"){
										var newOrg = new queryModels['Org']();
										newOrg.name = doc.organization;
										newOrg.admin_id = doc._id;
										newOrg.save(function(err){
											if (err) throw err;
											res.redirect('/register/org/details')
										})
									} else {
										res.redirect('/');
									}
								}
							})
						})
					})
				} else {
					res.redirect('/register/' + req.params.role)
				}
			}
		})
	})

}