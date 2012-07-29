module.exports = function(app, express){

	app.configure(function(){
	  app.set('port', process.env.PORT || 2004);
	  app.set('views', __dirname + '/views');
	  app.set('view engine', 'jade');
	  app.use(express.bodyParser());
	  app.use(express.cookieParser());
	  app.use(express.session({secret: "porkchopsandwiches"}));
	  app.use(express.methodOverride());
	  app.use(app.router);
	  app.use(express.static(__dirname + '/public'));
	});

	app.configure('development', function(){
	  app.use(express.errorHandler());
	});

}