module.exports=function(mongoose, Schema){

	var ChildSchema = new Schema({
		name : String,
		age : Number,
		gender : String,
		top_size : String,
		pant_size : Number,
		shoe_size : Number,
		details : String,
		avatar : String,
		org_id : String,
		org_name : String,
		wishlist : Array,
		joined : Number
	});

	var Child = exports.Child = mongoose.model('Child', ChildSchema);
}