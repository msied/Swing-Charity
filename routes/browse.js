Array.prototype.loopy=nodeLoop;

module.exports=function(app, express, mongoose){

	app.get('/see/', function(req,res){
		var logged = isLogged(req);
		queryModels["Request"].find({status : "unfulfilled"}, function(err,docs){
			if (err) throw err;
			var arr = [];
			docs.loopy(function(doc){
				delete doc._id;
				arr.push(doc);
			}, function(){
				res.render('browse', {logged : logged, title : 'See needs', needs : JSON.stringify(arr)})
			})
		})
	})

	app.get('/see/:wish', function(req,res){
		var logged = isLogged(req);
		queryModels["Request"].findOne({_id : req.params.wish}, function(err,doc){
			if (err) throw err;
			queryModels["Child"].findOne({_id : doc.child_id}, function(err,_doc){
				if (err) throw err;
				res.render('wish', {logged : logged, title : _doc.name, request : JSON.stringify(doc), child : JSON.stringify(_doc)})
			});
		})
	})

	app.get('/see/:wish/fulfill/', function(req,res){
		var logged = isLogged(req);
		queryModels["User"].findOne({_id : req.session.user._id}, function(err,doc){
			if (err) throw err;
			if (doc.pending.indexOf(req.params.wish) < 0){
				res.redirect('/see/');
			} else {
				queryModels["Request"].findOne({_id : req.params.wish}, function(err,doc){
					queryModels["Org"].findOne({_id : doc.org_id}, function(err,_doc){
						res.render('instructions', {logged : logged, title: 'Fulfillment Instructions', address : _doc.address})
					})
				})
			}
		});
	})

	app.get('/see/n/:wish/confirm', function(req,res){
		var logged = isLogged(req);
		queryModels["Request"].findOne({_id : req.params.wish}, function(err,doc){
			if (err) throw err;
			res.render('confirm', {logged : logged, title: 'Confirm', wish : JSON.stringify(doc)})
		})
	})

	app.post('/see/:wish/fulfill/', function(req,res){
		if (!req.session.user){
			res.redirect('/see/')
			return;
		}
		queryModels["Request"].findOne({_id : req.params.wish}, function(err,doc){
			if (err) throw err;
			doc.donor = {
				name : req.session.user.name,
				id : req.session.user._id
			}
			doc.status = "pending";
			doc.pledged = (new Date().getTime())
			doc.save(function(err){
				if (err) throw err;
				queryModels["User"].findOne({_id : req.session.user._id}, function(err,doc){
					doc.pending.push(req.params.wish)
					doc.save(function(err){
						if (err) throw err;
						res.redirect('/see/' + req.params.wish + '/fulfill/')
					})
				})
			})
		})
	})
}