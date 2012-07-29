module.exports=function(mongoose, Schema){

	var OrgSchema = new Schema({
		name : String,
		address : String,
		details : String,
		logo : String,
		admin_id : String,
		accepted : Number
	});

	var Org = exports.Org = mongoose.model('Org', OrgSchema);
}