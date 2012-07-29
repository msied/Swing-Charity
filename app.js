global.nodeLoop = function(execThis, callBack){
	var self = this,
	    len = self.length,
	    slen = len - 1,
	     _callBack = (callBack) ? callBack : function(){};
	while (len-- || _callBack()){
	    (function(){
	        var i = slen - len;
		    if (self[i]) execThis(self[i], (i))
		})()
	}
}

global.isLogged = function(req){
	return (req.session.user) ? ((req.session.user.role == 1) ? {type: "donor", name : req.session.user.name.first + " " + req.session.user.name.last} : {type : "org", name: req.session.user.organization}) : false;
}

var express = require('express'),
	mongoose = require('mongoose'),
    http = require('http'),
    app = express();

require('./schemas')(mongoose);
require('./config')(app, express);
require('./routes')(app, express, mongoose);

mongoose.connect('mongodb://localhost/swing');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
