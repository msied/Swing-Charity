module.exports=function(mongoose, Schema){

	var ReqSchema = new Schema({
		article : String,
		color : String,
		size : String,
		details : String,
		child_id : String,
		child_name : String,
		child_img : String,
		org_id : String,
		org_name : String,
		status : String,
		submitted : Number,
		pledged : Number,
		donor : {}
	});

	var Request = exports.Child = mongoose.model('Request', ReqSchema);
}