Array.prototype.loopy=nodeLoop;

module.exports=function(app){

	app.get('/org/manage/child/:id?', function(req,res){
		var logged = isLogged(req);
		if (!req.session.user || (req.session.user && req.session.user.role !== 2)){
			res.redirect('/')
		} else {
			queryModels["Child"].findOne({_id : req.params.id}, function(err,doc){
				if (err) throw err;
				var profile = JSON.stringify(doc);
				queryModels["Request"].find({child_id : req.params.id}, function(err,docs){
					if (err) throw err;
					var arr = []
					docs.loopy(function(doc){
						arr.push(doc)
					},
					function(){
						res.render('child_wishlist', {logged: logged, title: 'Wishlist', profile : profile, list : JSON.stringify(arr)})
					});
				})
			})
		}
	})
	app.post('/org/manage/child/:id?', function(req,res){
		if (!req.session.user || (req.session.user && req.session.user.role !== 2)){
			res.redirect('/')
		} else {
			queryModels["Child"].findOne({_id : req.params.id}, function(err,doc){
				if (err) throw err;
				var newWL = new queryModels["Request"]();	
				newWL.article = req.body.article;
				newWL.color = req.body.color;
				if (req.body.article == "Shirt" || req.body.article == "Jacket"){
					newWL.size = doc.top_size;
				} else if (req.body.article == "Pants"){
					newWL.size = doc.pant_size;
				} else if (req.body.article == "Shoes"){
					newWL.size = doc.shoe_size;
				}
				newWL.details = req.body.details;
				newWL.child_id = doc._id;
				newWL.child_name = doc.name;
				newWL.child_img = doc.avatar;
				newWL.org_id = doc.org_id;
				newWL.org_name = doc.org_name;
				newWL.submitted = (new Date().getTime());
				newWL.status = "unfulfilled";
				newWL.save(function(err,wdoc){
					if (err) throw err;
					doc.wishlist.push({_id : wdoc._id, status : "pending"})
					doc.save(function(err){
						if (err) throw err;
						res.redirect('/org/manage/child/' + req.params.id);
					})
				})
			})
		}
	})
	app.get('/org/manage/child/:id/:wid?', function(req,res){
		var logged = isLogged(req);
		if (!req.session.user || (req.session.user && req.session.user.role !== 2)){
			res.redirect('/')
		} else {
			queryModels["Child"].findOne({_id : req.params.id}, function(err,doc){
				if (err) throw err;
				queryModels["Request"].findOne({_id : req.params.wid}, function(err,doc){
					if (err) throw err;
					res.write(JSON.stringify(doc))
					res.end();
				})
			})
		}
	})

}