Array.prototype.loopy=nodeLoop;

module.exports=function(app){

	app.get('/org/', function(req,res){
		var logged = isLogged(req);
		if (!req.session.user || (req.session.user && req.session.user.role !== 2)){
			res.redirect('/')
		} else {
			queryModels['Org'].findOne({admin_id: req.session.user._id}, function(err,doc){
				if (err) throw err;
				var logo = doc.logo;
				var approved = (req.session.user.approved == true) ? "active" : "pending approval";
				var accepted = (doc.accepted) ? doc.accepted : 0;
				queryModels['Child'].find({org_id : doc._id}, function(err,docs){
					if (err) throw err;
					var count = docs.length;
					res.render('org_home', {org: JSON.stringify(doc), logged: logged, title : 'Organization Management', accepted : accepted, approved : approved, children : count, logo: logo})
				})
			})
		}
	})

	app.get('/org/view/:oid?', function(req,res){
		var logged = isLogged(req);
		queryModels["Org"].findOne({_id: req.params.oid}, function(err,doc){
			if (err) throw err;
			res.render('org_front', {logged : logged, title: doc.name, org : JSON.stringify(doc)})
		})
	})

	app.get('/org/manage', function(req,res){
		var logged = isLogged(req);
		if (!req.session.user || req.session.user.role !== 2){
			res.redirect('/');
		} else {
			queryModels['Org'].findOne({admin_id: req.session.user._id}, function(err,doc){
				if (err) throw err;
				var lol = JSON.stringify(doc);
				queryModels['Child'].find({org_id : doc._id}, function(err,docs){
					if (err) throw err;
					var arr = []
					docs.loopy(function(doc){
						arr.push(doc)
					},function(){
						res.render('org_manage', {org : lol, logged : logged, title : 'Organization Management', kids : JSON.stringify(arr)})
					})
				})
			})
		}
	})

	app.get('/org/pending', function(req,res){
		var logged = isLogged(req);
		if (!req.session.user || req.session.user.role !== 2){
			res.redirect('/');
		} else {
			queryModels['Org'].findOne({admin_id: req.session.user._id}, function(err,doc){
				if (err) throw err;
				queryModels["Request"].find({org_id : doc._id, status : "pending"}, function(err,_docs){
					if (err) throw err;
					res.render("org_pending", {logged: logged, title : 'Pending donations', pending : JSON.stringify(_docs)})
				})
			})
		}
	})

	app.get('/org/manage/add/', function(req,res){
		var logged = isLogged(req);
		if (!req.session.user || req.session.user.role !== 2){
			res.redirect('/');
		} else {
			res.render('org_add_child', {logged: logged, title : 'Add child'})
		}
	});

	app.post('/org/manage/add/', function(req,res){
		if (!req.session.user || req.session.user.role !== 2){
			res.redirect('/');
		} else {
			var newChild = new queryModels["Child"]();
			newChild.name = req.body.name;
			newChild.age = parseInt(req.body.age);
			newChild.details = req.body.details;
			newChild.avatar = req.body.avatar;
			newChild.gender = req.body.gender;
			newChild.top_size = req.body.top_size;
			newChild.pant_size = parseInt(req.body.pant_size);
			newChild.shoe_size = parseInt(req.body.shoe_size);
			newChild.org_name = req.session.user.organization;
			newChild.joined = (new Date().getTime());
			queryModels["Org"].findOne({admin_id : req.session.user._id}, function(err,doc){
				if (err) throw err;
				newChild.org_id = doc._id;
				newChild.save(function(err){
					res.redirect('/org/manage/')
				})
			})
		}
	})

	app.post('/org/manage/edit/', function(req,res){
		if (!req.session.user || req.session.user.role !== 2){
			res.redirect('/');
		} else {
			var _data = '';
			req.on('data', function(data){
				_data += data;
			});
			req.on('end', function(){
			    var data = JSON.parse(_data);
			    queryModels["Child"].findOne({_id : data._id}, function(err,doc){
			    	if (err) throw err;
			    	delete data._id;
			    	for (key in data){
			    		(function(){
			    			var k = key;
			    			if (data[k] && data[k] !== "") doc[k] = data[k];
			    		})()
			    	}
			    	doc.save(function(err){
			    		res.write(JSON.stringify({success : true}))
			    		res.end();
			    	})
			    })
			})
		}
	});

	app.get('/org/pending/:action/:wid?', function(req,res){
		if (!req.session.user || req.session.user.role !== 2){
			res.redirect('/');
		} else {
			queryModels["Request"].findOne({_id : req.params.wid}, function(err,doc){
				if (err) throw err;
				queryModels["User"].findOne(function(err,_doc){
					if (err) throw err;
					var indx = _doc.pending.indexOf(doc._id);
					_doc.pending.splice(indx,1);
					if (req.params.action == "accept"){
						_doc.delivered.push(doc._id);
						doc.status = "fulfilled";
						queryModels["Org"].findOne({admin_id: req.session.user._id}, function(err,__doc){
							__doc.accepted = (__doc.accepted) ? __doc.accepted + 1 : 1;
							__doc.save();
							_doc.save();
							doc.save(function(err){
								if (err) throw err;
								res.redirect('/org/pending/')
							})
						})
					} else if (req.params.action == "decline"){
						doc.status = "unfulfilled";
						delete doc.pledged;
						doc.save(function(err){
							if (err) throw err;
							res.redirect('/org/pending/')
						})
					}
				});
			})
		}
	})

}