module.exports=function(mongoose){
	var Schema = mongoose.Schema;

	require('./user')(mongoose, Schema)
	require('./org')(mongoose, Schema)
	require('./children')(mongoose, Schema)
	require('./request')(mongoose, Schema)


}