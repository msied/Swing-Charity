module.exports=function(mongoose, Schema){

	var UserSchema = new Schema({
		salt : String,
		password : String,
		role : Number,
		organization : String,
		name : {
			first : String,
			last : String
		},
		email : String,
		phone : Number,
		approved : Boolean,
		pending : Array,
		delivered : Array,
		requested : Array,
		avatar : String
	});

	var User = exports.User = mongoose.model('User', UserSchema);
}